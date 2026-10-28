from db import Role, users_db
from fastapi import APIRouter, HTTPException, Response, status
from schemas import LoginIn, PasswordChangeIn, ProfileUpdateIn, SignupIn, UserOut
from security import (
    CurrentUser,
    SessionToken,
    authenticate,
    clear_session_cookie,
    hash_password,
    revoke_other_sessions,
    revoke_session_token,
    set_session_cookie,
)
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(body: SignupIn, response: Response) -> UserOut:
    try:
        user = users_db.add_user(
            body.username,
            body.first_name,
            body.last_name,
            body.email,
            Role.GUEST,
            password_hash=hash_password(body.password),
        )
    except IntegrityError:
        # email is the only unique column signup sets
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Email already registered"
        ) from None
    set_session_cookie(response, user.id)
    return UserOut.model_validate(user)


@router.post("/login")
def login(body: LoginIn, response: Response) -> UserOut:
    user = authenticate(body.email, body.password)
    if user is None:
        # same message for unknown email and wrong password to not reveal accs
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    # Enforce: non-admin users without a job should be GUEST
    if user.job is None and user.role != Role.ADMIN:
        user.role = Role.GUEST
        users_db.update_user(user.id, {"role": Role.GUEST})
    set_session_cookie(response, user.id)
    return UserOut.model_validate(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response, token: SessionToken) -> None:
    # invalidate the session on the server first
    revoke_session_token(token)
    clear_session_cookie(response)


@router.get("/me")
def me(user: CurrentUser) -> UserOut:
    # Enforce: non-admin users without a job should be GUEST
    if user.job is None and user.role != Role.ADMIN:
        user.role = Role.GUEST
        users_db.update_user(user.id, {"role": Role.GUEST})
    return UserOut.model_validate(user)


@router.patch("/me")
def update_me(body: ProfileUpdateIn, user: CurrentUser) -> UserOut:
    # none of these cols can be null so a null = no change
    changes = body.model_dump(exclude_none=True)
    if "avatar" in body.model_fields_set and body.avatar is None:
        changes["avatar"] = None
    updated = users_db.update_user(user.id, changes)
    # avatar is the only col that can back to null
    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return UserOut.model_validate(updated)


@router.patch("/me/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(body: PasswordChangeIn, user: CurrentUser, token: SessionToken) -> None:
    if user.password_hash is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "This account logged in using 42, no password to change"
        )
    # asked again so someone using a session left open can't lock the owner out
    # 400 and not 401: the user is logged in, only the password they typed is wrong
    if authenticate(user.email, body.current_password) is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current password is incorrect")
    if body.new_password == body.current_password:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "The new password must be different"
        )
    updated = users_db.update_user(
        user.id, {"password_hash": hash_password(body.new_password)}
    )
    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    revoke_other_sessions(token, user.id)
