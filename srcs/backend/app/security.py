from datetime import UTC, datetime, timedelta
from typing import Annotated

import jwt
from config import settings
from db import User, users_db
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
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(minutes=settings.jwt_expire_minutes),
    }
    return jwt.encode(payload, settings.session_secret, algorithm=JWT_ALGORITHM)


def set_session_cookie(response: Response, user_id: int) -> None:
    response.set_cookie(
        SESSION_COOKIE,
        create_session_token(user_id),
        max_age=settings.jwt_expire_minutes * 60,
        httponly=True, # JS can't access it
        secure=True, # https only
        samesite="lax", # not sent on cross site POST
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
    unauthorized = HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    if token is None:
        raise unauthorized
    try:
        payload = jwt.decode(
            token,
            settings.session_secret,
            algorithms=[JWT_ALGORITHM],
            options={"require": ["exp", "sub"]},
        )
    except jwt.InvalidTokenError:
        raise unauthorized from None
    # loaded on every request, so a deleted user or a role change applies directly
    user = users_db.get_user(int(payload["sub"]))
    if user is None:
        raise unauthorized
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
