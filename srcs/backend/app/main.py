from config import settings
from db.connection import engine
from fastapi import FastAPI
from routers import auth
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"status": "ok"}

