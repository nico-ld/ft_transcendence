from sqlalchemy import Engine, select
from sqlalchemy.orm import Session

from .connection import Role, User, engine


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

    def add_user(
        self,
        username: str,
        first_name: str,
        last_name: str,
        email: str,
        role: Role,
        avatar: str | None = None,
        job: str | None = None,
        password_hash: str | None = None,
    ) -> User:
        """Add a user.

        Add a new User with the username, first_name, last_name, email, role,
        avatar, job and password_hash provided.

        Args:
            username (str): the user display name.
            first_name (str): the user first name.
            last_name (str): the user last name.
            email (str): the user email
            role (Role): the user role.
            avatar (str | None): the string path to the avatar, None if no
                avatar provided. Defaults to None.
            job (str | None): the user job, None if not provided. Defaults to None.
            password_hash (str | None): the argon2 hash of the password, None for
                accounts that only log in with 42. Defaults to None.

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


request: SQLRequest = SQLRequest(engine)
