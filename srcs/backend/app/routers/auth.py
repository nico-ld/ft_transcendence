from db import Role, request
from fastapi import APIRouter, HTTPException, Response, status
from schemas import LoginIn, SignupIn, UserOut
from security import (
    CurrentUser,
    authenticate,
    clear_session_cookie,
    hash_password,
    set_session_cookie,
)
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(body: SignupIn, response: Response) -> UserOut:
    try:
        user = request.add_user(
            body.username,
            body.first_name,
            body.last_name,
            body.email,
            Role.DEV,
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
    set_session_cookie(response, user.id)
    return UserOut.model_validate(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response) -> None:
    clear_session_cookie(response)


@router.get("/me")
def me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)
