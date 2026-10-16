from contextlib import asynccontextmanager

from db import Base, engine
from fastapi import FastAPI
from routers import users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # all models are imported through db so it creates every table
    Base.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)
# app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)
# app.include_router(auth.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"status": "ok"}
