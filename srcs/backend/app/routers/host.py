from db import users_db
from fastapi import APIRouter, HTTPException, status
from schemas import PasswordChangeIn
from security import CurrentUser, authenticate, hash_password

# endpoints of the logged in user on their own account
# (users.py is for the admin endpoints)
router = APIRouter(prefix="/host", tags=["host"])


@router.patch("/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(body: PasswordChangeIn, user: CurrentUser) -> None:
    """Change the password of the logged in user.

    The current password is asked again, so someone using a session left open
    can't lock the owner out. The session stays valid after the change.

    Args:
        body (PasswordChangeIn): the current and the new password.
        user (CurrentUser): the logged in user (401 if not logged in).

    Raises:
        HTTPException: 400 if the account has no password (42 only), the
            current password is wrong or the new one is the same.
    """
    # accounts created by "Log in with 42" have no password to check or change
    if user.password_hash is None:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "This account logs in with 42, it has no password"
        )
    # 400 and not 401: the user is logged in, only the password they typed is wrong
    if authenticate(user.email, body.current_password) is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current password is incorrect")
    if body.new_password == body.current_password:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "The new password must be different"
        )
    # same column and hashing (argon2id) as signup and user creation
    updated = users_db.update_user(
        user.id, {"password_hash": hash_password(body.new_password)}
    )
    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
