
from config import settings
from db import *
from db.requests import requestUser
from fastapi import FastAPI
from routers import auth
from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()
# app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)
# app.include_router(auth.router)


@app.post("/user/")
async def create_user(name: str, lastname:str, email:str, avatar: str|None = None, role: Roles = Roles.Dev) -> None:
	requestUser.AddUser(name, lastname, email, role, avatar)

@app.get("/user/{user_id}/{field}")
async def get_user_field(user_id: int, field: str) -> str|Roles|None:
	res = requestUser.GetUserField(user_id, field)
	return res

@app.get("/user/{user_id}")
async def get_user(user_id: int) -> UserFront|None:
	res: User|None = requestUser.GetUser(user_id)
	if (res == None):
		return None
	ret: UserFront = UserFront(id=res.id, name=res.name, lastname=res.lastname, email=res.email, role=res.role, avatar=res.avatar)
	return ret

@app.put("/user/{user_id}/{fieldname}")
async def update_user_field(user_id: int, fieldname: str, fieldvalue: str|Roles| None) -> bool:
	res = requestUser.UpdateUserField(user_id, fieldname, fieldvalue)
	return res

@app.get("/user/")
async def get_id(name:str, lastname:str, email:str) -> int|None:
	res = requestUser.getID(name, lastname, email)
	return res

@app.delete("/user/{user_id}")
async def del_user(user_id: int) -> bool:
	res = requestUser.DelUser(user_id)
	return res
