from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
from config import settings
from db import Role, User, users_db
from db.sessions import sessions_db
from fastapi import Depends, HTTPException, Response, status
from fastapi.security import APIKeyCookie
from pwdlib import PasswordHash

SESSION_COOKIE = "session"
JWT_ALGORITHM = "HS256"

password_hasher = PasswordHash.recommended()  # argon2id
# checked when the email has no password, so that a wrong email takes
# as long as a wrong password and response times don't reveal accs
_DUMMY_HASH = password_hasher.hash("67 dummy password used to equalize login timing")


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def authenticate(email: str, password: str) -> User | None:
    """Check credentials.

    Args:
        email (str): the email in lowercase
        password (str): the password as typed

    Returns:
        User | None: the user if the password matches, None if the email is
        unknown, the account has no password (42 only) or the password is wrong
    """
    user = users_db.get_user_by_email(email)
    if user is None or user.password_hash is None:
        password_hasher.verify(password, _DUMMY_HASH)
        return None
    if not password_hasher.verify(password, user.password_hash):
        return None
    return user


def create_session_token(user_id: int) -> str:
    now = datetime.now(UTC)
    expires = now + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": str(user_id),
        # a row in the sessions table (db/sessions.py): deleting it invalidates
        # this token, see user_from_token
        "sid": sessions_db.create_session(user_id, expires),
        "iat": now,
        "exp": expires,
    }
    return jwt.encode(payload, settings.session_secret, algorithm=JWT_ALGORITHM)


def set_session_cookie(response: Response, user_id: int) -> None:
    response.set_cookie(
        SESSION_COOKIE,
        create_session_token(user_id),
        max_age=settings.jwt_expire_minutes * 60,
        httponly=True,  # JS can't access it
        secure=True,  # https only
        samesite="lax",  # not sent on cross site POST
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        SESSION_COOKIE, path="/", httponly=True, secure=True, samesite="lax"
    )


# reads the cookie and shows the auth requirement in the OpenAPI docs
session_cookie = APIKeyCookie(name=SESSION_COOKIE, auto_error=False)


def get_current_user(token: Annotated[str | None, Depends(session_cookie)]) -> User:
    """FastAPI dependency: the logged in user or a 401"""
    user = user_from_token(token)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    return user


def user_from_token(token: str | None) -> User | None:
    """The user of a session JWT, or None if missing, invalid, expired, logged
    out or deleted"""
    if token is None:
        return None
    try:
        payload = jwt.decode(
            token,
            settings.session_secret,
            algorithms=[JWT_ALGORITHM],
            # tokens made before sessions existed have no sid: refused
            options={"require": ["exp", "sub", "sid"]},
        )
    except jwt.InvalidTokenError:
        return None
    # a valid signature isn't enough: the session must still exist (logout
    # and account deletion remove it)
    if not sessions_db.is_active(payload["sid"], int(payload["sub"])):
        return None
    return users_db.get_user(int(payload["sub"]))


def revoke_session_token(token: str | None) -> None:
    """Logout: delete the session of a JWT so the cookie stops working everywhere,
    even if someone kept a copy. Other browsers of the same user stay logged in.
    """
    if token is None:
        return
    try:
        payload = jwt.decode(
            token,
            settings.session_secret,
            algorithms=[JWT_ALGORITHM],
            # an expired token can still be logged out, it just cleans its row
            options={"require": ["sid"], "verify_exp": False},
        )
    except jwt.InvalidTokenError:
        return  # not one of ours, nothing to delete
    sessions_db.delete_session(payload["sid"])


# the raw session cookie, for routes that need the token itself (logout)
SessionToken = Annotated[str | None, Depends(session_cookie)]

CurrentUser = Annotated[User, Depends(get_current_user)]


def require_admin(user: CurrentUser) -> User:
    """FastAPI dependency that returns the logged in admin, 401 if not logged in, 403 if not admin"""
    if user.role != Role.ADMIN:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Forbidden")
    return user


AdminUser = Annotated[User, Depends(require_admin)]


def revoke_other_sessions(token: str | None, user_id: int) -> None:
    """Log out every other browser of the user except this one"""
    if token is None:
        return
    payload = jwt.decode(token, settings.session_secret, algorithms=[JWT_ALGORITHM])
    sessions_db.delete_user_sessions(user_id, keep=payload["sid"])
