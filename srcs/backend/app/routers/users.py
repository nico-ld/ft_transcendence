from db import Role, users_db
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import UserOut
from security import AdminUser, require_admin

router = APIRouter(
    prefix="/users", tags=["users"], dependencies=[Depends(require_admin)]
)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(
    username: str,
    first_name: str,
    last_name: str,
    email: str,
    avatar: str | None = None,
    job: str | None = None,
    role: Role = Role.SOFTWARE_ENGINEER,
) -> UserOut:
    user = users_db.add_user(username, first_name, last_name, email, role, avatar, job)
    return UserOut.model_validate(user)


@router.get("/{user_id}")
def get_user(user_id: int) -> UserOut:
    user = users_db.get_user(user_id)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return UserOut.model_validate(user)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, admin: AdminUser) -> None:
    if user_id == admin.id:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "You can't delete your own account"
        )
    if not users_db.delete_user(user_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")


@router.get("", status_code=status.HTTP_200_OK)
def list_users() -> list[UserOut]:
    return [UserOut.model_validate(user) for user in users_db.list_users()]
