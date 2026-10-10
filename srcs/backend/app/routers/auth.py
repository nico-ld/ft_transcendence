from authlib.integrations.starlette_client import OAuth, OAuthError
from config import settings
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

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


@router.get("/42/login")
async def login_42(request: Request):
    redirect_uri = request.url_for("callback_42")
    return await oauth.fortytwo.authorize_redirect(request, redirect_uri)


@router.get("/42/callback", name="callback_42")
async def callback_42(request: Request):
    try:
        token = await oauth.fortytwo.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=f"42 auth failed: {e.error}")

    resp = await oauth.fortytwo.get("me", token=token)
    profile = resp.json()
    print(profile)
    # TODO: create session/JWT and set it as an HttpOnly cookie

    response = RedirectResponse(settings.frontend_url)
    # response.set_cookie("access_token", jwt, httponly=True, samesite="lax")
    return response
