import logging
import time
from contextlib import asynccontextmanager

from aiodocker import Docker
from config import settings
from db import Base, Role, engine, users_db
from fastapi import FastAPI
from routers import (
    auth,
    events,
    friends,
    metrics,
    oauth42,
    stats,
    users,
    websocket,
    workspace,
)
from security import hash_password
from starlette.middleware.sessions import SessionMiddleware

logger = logging.getLogger("uvicorn.error")
start = time.time()


def create_initial_admin() -> None:
    """Create the admin account if it doesn't exist"""
    if settings.admin_email is None or settings.admin_password is None:
        return
    email = settings.admin_email.lower()
    existing = users_db.get_user_by_email(email)
    if existing is not None:
        # do not change an existing account, could overwrite an user account into admin
        if existing.role != Role.ADMIN:
            logger.warning(
                "ADMIN_EMAIL %s is a non admin account, so it wasn't created", email
            )
        return
    users_db.add_user(
        "admin",
        "Admin",
        "Admin",
        email,
        Role.ADMIN,
        password_hash=hash_password(settings.admin_password),
    )
    logger.info("Created the initial admin account %s", email)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # all models are imported through db so it creates every table
    Base.metadata.create_all(engine)
    create_initial_admin()
    async with Docker(url=settings.docker_url) as docker:
        app.state.docker = docker
        yield


app = FastAPI(lifespan=lifespan)

# only holds authlib OAuth state during the 42 redirect, its own cookie name
# so it doesnt overwrite our session JWT cookie
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret,
    session_cookie="oauth_state",
    max_age=600,
    https_only=True,
)
app.include_router(oauth42.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(friends.router)
app.include_router(stats.router)
app.include_router(websocket.router)
app.include_router(events.router)
app.include_router(workspace.router)
app.include_router(metrics.router)


@app.get("/")
def root():
    return {"status": "ok", "robert": 67, "uptime": int(time.time() - start)}
