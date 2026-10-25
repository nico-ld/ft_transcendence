from enum import StrEnum

import httpx2
from authlib.integrations.starlette_client import OAuth, OAuthError
from config import settings
from db import Role, User, users_db
from fastapi import APIRouter, HTTPException, Request, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from schemas import Email
from security import set_session_cookie
from sqlalchemy.exc import IntegrityError

oauth = OAuth()
oauth.register(
    name="fortytwo",
    client_id=settings.ft_client_id,
    client_secret=settings.ft_client_secret,
    authorize_url="https://api.intra.42.fr/oauth/authorize",
    access_token_url="https://api.intra.42.fr/oauth/token",
    api_base_url="https://api.intra.42.fr/v2/",
    client_kwargs={"scope": "public"},
)

router = APIRouter(prefix="/auth", tags=["auth"])

# where each role lands after logging in with 42
ROLE_HOME = {Role.ADMIN: "/admin", Role.USER: "/user"}

#each match an oauth error situation, like cancelled = the user clicked "Cancel" on the 42 page
class FtLoginError(StrEnum):
    CANCELLED = "oauth_cancelled"
    EXPIRED = "oauth_expired"
    UNAVAILABLE = "oauth_unavailable"
    CONFLICT = "oauth_conflict"


OAUTH_ERROR_REASONS = {
    "access_denied": FtLoginError.CANCELLED,
    "mismatching_state": FtLoginError.EXPIRED,
    "invalid_grant": FtLoginError.EXPIRED,
}

#Send the browser back to the login page + explains what happened
def login_failed(reason: FtLoginError) -> RedirectResponse:
    return RedirectResponse(f"{settings.frontend_url}/login?error={reason}")


class FtImage(BaseModel):
    link: str | None = None


# Fields matching 42 oauth response
class FtProfile(BaseModel):
    id: int
    email: Email
    login: str
    first_name: str
    last_name: str
    image: FtImage | None = None


def get_or_create_42_user(profile: FtProfile) -> User:
    user = users_db.get_user_by_ft_id(profile.id)
    if user is not None:
        return user

    user = users_db.get_user_by_email(profile.email)
    if user is not None:
        # security against concurrent callback between two lookups
        if user.ft_id == profile.id:
            return user
        if user.ft_id is not None:
            raise HTTPException(
                status.HTTP_409_CONFLICT, "This email is linked to another 42 account"
            )
        linked = users_db.link_ft_id(user.id, profile.id)
        if linked is not None:
            return linked

    try:
        return users_db.add_user(
            profile.login,
            profile.first_name,
            profile.last_name,
            profile.email,
            Role.USER,
            avatar=profile.image.link if profile.image else None,
            ft_id=profile.id,
        )
    except IntegrityError:
        # security against two callbacks for the same user at once
        user = users_db.get_user_by_ft_id(profile.id)
        if user is None:
            raise
        return user


@router.get("/42/login")
async def login_42(request: Request):
    redirect_uri = request.url_for("callback_42")
    return await oauth.fortytwo.authorize_redirect(request, redirect_uri)


@router.get("/42/callback", name="callback_42")
async def callback_42(request: Request):
    try:
        token = await oauth.fortytwo.authorize_access_token(request)
        resp = await oauth.fortytwo.get("me", token=token)
    except OAuthError as e:
        return login_failed(OAUTH_ERROR_REASONS.get(e.error, FtLoginError.UNAVAILABLE))
    except (httpx2.HTTPError, ValueError):
        return login_failed(FtLoginError.UNAVAILABLE)

    if resp.status_code != 200:
        return login_failed(FtLoginError.UNAVAILABLE)
    try:
        profile = FtProfile.model_validate(resp.json())
    except ValueError:
        return login_failed(FtLoginError.UNAVAILABLE)

    try:
        user = await run_in_threadpool(get_or_create_42_user, profile)
    except HTTPException as e:
        if e.status_code != status.HTTP_409_CONFLICT:
            raise
        return login_failed(FtLoginError.CONFLICT)

    response = RedirectResponse(settings.frontend_url + ROLE_HOME[user.role])
    set_session_cookie(response, user.id)
    return response
