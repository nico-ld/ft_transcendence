from db import Role, request
from fastapi import APIRouter, HTTPException, status
from schemas import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(
    username: str,
    first_name: str,
    last_name: str,
    email: str,
    avatar: str | None = None,
    job: str | None = None,
    role: Role = Role.DEV,
) -> UserOut:
    user = request.add_user(username, first_name, last_name, email, role, avatar, job)
    return UserOut.model_validate(user)


@router.get("/{user_id}")
def get_user(user_id: int) -> UserOut:
    user = request.get_user(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return UserOut.model_validate(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int) -> None:
    if not request.delete_user(user_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
