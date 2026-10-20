from sqlalchemy import Engine, select
from sqlalchemy.orm import Session
from typing_extensions import Any

from .connection import Job, Role, User, engine


class SQLRequest:
    engine: Engine

    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def get_user(self, user_id: int) -> User | None:
        """Get a user from the db.

        Retrieve the first User row where the id provided matches User.id.

        Args:
            user_id (int): the user id.

        Returns:
            User | None: the matching User, or None if no User matches.
        """
        with Session(self.engine) as sess:
            stmt = select(User).where(User.id == user_id)
            return sess.scalar(stmt)

    def get_user_by_email(self, email: str) -> User | None:
        """Get a user from the db by email.

        Args:
            email (str): the user email, already lowercased.

        Returns:
            User | None: the matching User, or None if no User matches.
        """
        with Session(self.engine) as sess:
            stmt = select(User).where(User.email == email)
            return sess.scalar(stmt)

    def get_user_by_ft_id(self, ft_id: int) -> User | None:
        """Get a user from the db by 42 user id.

        Args:
            ft_id (int): the id of the user on the 42 intra.

        Returns:
            User | None: the matching User, or None if no User matches.
        """
        with Session(self.engine) as sess:
            stmt = select(User).where(User.ft_id == ft_id)
            return sess.scalar(stmt)

    def link_ft_id(self, user_id: int, ft_id: int) -> User | None:
        """Link a 42 account to an existing user.

        Args:
            user_id (int): the user id.
            ft_id (int): the id of the user on the intra.

        Returns:
            User | None: the updated User, or None if no User matches.

        Raises:
            IntegrityError: the ft_id is already linked to another user.
        """
        with Session(self.engine) as sess:
            user: User | None = sess.get(User, user_id)
            if user is None:
                return None
            user.ft_id = ft_id
            sess.commit()
            sess.refresh(user)
        return user

    def add_user(
        self,
        username: str,
        first_name: str,
        last_name: str,
        email: str,
        role: Role,
        avatar: str | None = None,
        job: Job | None = None,
        password_hash: str | None = None,
        ft_id: int | None = None,
    ) -> User:
        """Add a user.

        Add a new User with the username, first_name, last_name, email, role,
        avatar, job, password_hash and ft_id provided.

        Args:
            username (str): the user display name.
            first_name (str): the user first name.
            last_name (str): the user last name.
            email (str): the user email
            role (Role): what the account is allowed to do.
            avatar (str | None): the string path to the avatar, None if no
                avatar provided. Defaults to None.
            job (Job | None): the workspace the user gets, None for no
                workspace. Defaults to None.
            password_hash (str | None): the argon2 hash of the password, None for
                accounts that only log in with 42. Defaults to None.
            ft_id (int | None): the id of the user on the intra, None for
                accounts that only log in with email/pass. Defaults to None.

        Raises:
            IntegrityError: the email (or ft_id) is already used, or the account
                has neither a password_hash nor an ft_id.
        """
        with Session(self.engine) as sess:
            user = User(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                role=role,
                avatar=avatar,
                job=job,
                password_hash=password_hash,
                ft_id=ft_id,
            )
            sess.add(user)
            sess.commit()
            sess.refresh(user)
        return user

    def delete_user(self, user_id: int) -> bool:
        """Delete a User.

        Delete the User where the id provided matches User.id.

        Args:
            user_id (int): the user id.

        Returns:
            bool: True if a User matched and was deleted, False if no User matches.
        """
        with Session(self.engine) as sess:
            user: User | None = sess.get(User, user_id)
            if user is None:
                return False
            sess.delete(user)
            sess.commit()
            return True

    def list_users(self) -> list[User]:
        """Get every user from the db

        Returns:
            list[User]: all of the users
        """
        with Session(self.engine) as sess:
            stmt = select(User).order_by(User.id)
            return list(sess.scalars(stmt))

    def update_user(self, user_id: int, changes: dict[str, Any]) -> User | None:
        """Update some columns of a user"""

        with Session(self.engine) as sess:
            user: User | None = sess.get(User, user_id)
            if user is None:
                return None
            for column, value in changes.items():
                setattr(user, column, value)
            sess.commit()
        return user


users_db: SQLRequest = SQLRequest(engine)
