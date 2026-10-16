from config import settings
from fastapi import FastAPI
from routers import auth
from starlette.middleware.sessions import SessionMiddleware

#from db.requests import request

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"status": "ok"}
