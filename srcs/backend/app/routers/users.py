from db import Role, users_db
from fastapi import APIRouter, Depends, HTTPException, status
from schemas import UserCreateIn, UserOut, UserUpdateIn
from security import AdminUser, hash_password, require_admin
from sqlalchemy.exc import IntegrityError

router = APIRouter(
    prefix="/users", tags=["users"], dependencies=[Depends(require_admin)]
)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(body: UserCreateIn) -> UserOut:
    try:
        user = users_db.add_user(
            body.username,
            body.first_name,
            body.last_name,
            body.email,
            body.role,
            job=body.job,
            password_hash=hash_password(body.password),
        )
    except IntegrityError:
        # email is the only unique column set here
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Email already registered"
        ) from None
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


@router.patch("/{user_id}")
def update_user(user_id: int, body: UserUpdateIn, admin: AdminUser) -> UserOut:
    # only the keys the client sent with snake_case names = the col names
    changes = body.model_dump(exclude_unset=True)
    if user_id == admin.id and changes.get("role", Role.ADMIN) != Role.ADMIN:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "You can't remove your own admin role"
        )
    user = users_db.update_user(user_id, changes)
    if user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    return UserOut.model_validate(user)
