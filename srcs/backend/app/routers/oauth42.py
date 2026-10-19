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


class FtImage(BaseModel):
    link: str | None = None


class FtProfile(BaseModel):
    """The fields we use from the 42 oauth response"""

    id: int
    email: Email
    login: str
    first_name: str
    last_name: str
    image: FtImage | None = None


def get_or_create_42_user(profile: FtProfile) -> User:
    """Find the user of a 42 profile, link or create an account.

    Args:
        profile (FtProfile): the profile returned by 42

    Returns:
        User: the user to login

    Raises:
        HTTPException: 409 if the email belongs to an account already linked
            to another 42 account.
    """
    user = users_db.get_user_by_ft_id(profile.id)
    if user is not None:
        return user

    user = users_db.get_user_by_email(profile.email)
    if user is not None:
        if user.ft_id == profile.id:
            # created by a concurrent callback between the two lookups
            # which is very rare but may happen so who knows
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
            Role.SOFTWARE_ENGINEER,
            avatar=profile.image.link if profile.image else None,
            ft_id=profile.id,
        )
    except IntegrityError:
        # two callbacks for the same new user at once,
        # the other one won, very likely but still here
        # because it maaaay happen
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
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=f"42 auth failed: {e.error}") from e

    resp = await oauth.fortytwo.get("me", token=token)
    if resp.status_code != 200:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "Couldn't get the 42 profile")
    try:
        profile = FtProfile.model_validate(resp.json())
    except ValueError:  # not JSON, or a pydantic error on 42 info
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY, "Unexpected 42 profile"
        ) from None

    # the DB calls are sync so we run them in the threadpool
    # to not block the event loop since we can't put this func
    # in sync because we await for 42 oauth.
    user = await run_in_threadpool(get_or_create_42_user, profile)

    response = RedirectResponse(settings.frontend_url)
    set_session_cookie(response, user.id)
    return response
