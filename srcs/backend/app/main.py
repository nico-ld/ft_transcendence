import logging
from contextlib import asynccontextmanager

from config import settings
from db import Base, Role, engine, request
from fastapi import FastAPI
from routers import auth, oauth42, users
from security import hash_password

logger = logging.getLogger("uvicorn.error")


def create_initial_admin() -> None:
    """Create the admin account if it doesn't exist"""
    if settings.admin_email is None or settings.admin_password is None:
        return
    email = settings.admin_email.lower()
    existing = request.get_user_by_email(email)
    if existing is not None:
        # never change an existing account: it could be someone's own signup
        if existing.role != Role.ADMIN:
            logger.warning(
                "ADMIN_EMAIL %s is a non admin account, so it wasn't created", email
            )
        return
    request.add_user(
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
    yield


app = FastAPI(lifespan=lifespan, root_path="/api")
# app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)
# app.include_router(oauth42.router)
app.include_router(auth.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"status": "ok"}
