from app.config import settings
from app.routers import auth
from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)
app.include_router(auth.router)


@app.get("/")
def root():
    return {"status": "ok"}
