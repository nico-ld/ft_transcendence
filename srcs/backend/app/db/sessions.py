"""Login sessions: one row per logged in browser.

The id of the row is put in the session JWT (security.py, claim "sid"), and
every request checks that the row still exists. Deleting the row kills the
cookie, even if someone kept a copy of it:
- POST /auth/logout deletes the row of that browser only
- deleting a user deletes all of their rows (ON DELETE CASCADE, in postgres)
- a reset database has no rows, so cookies from before the reset are refused

The table is created at startup by Base.metadata.create_all (main.py), like
users: this module is imported by security.py, which main.py imports first.
"""

import secrets
from datetime import datetime

from sqlalchemy import DateTime, Engine, ForeignKey, String, delete, func, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from .connection import Base, engine


class UserSession(Base):
    # not "Session", because it's reserved by SQLAlchemy class (used to talk to the db)
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    # postgres deletes the sessions of a user when the user is deleted
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    # same as the JWT "exp"
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    def __repr__(self) -> str:
        return f"Session of user {self.user_id}, expires {self.expires_at}"


class SessionRequest:
    engine: Engine

    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def create_session(self, user_id: int, expires_at: datetime) -> str:
        """Open a session for a user.

        Also deletes the expired sessions of everyone, so the table doesn't grow
        forever.

        Args:
            user_id (int): the user id.
            expires_at (datetime): when the session ends (the JWT "exp").

        Returns:
            str: the session id, to put in the JWT.
        """
        session_id = secrets.token_urlsafe(32)
        with Session(self.engine) as sess:
            sess.execute(delete(UserSession).where(UserSession.expires_at < func.now()))
            sess.add(UserSession(id=session_id, user_id=user_id, expires_at=expires_at))
            sess.commit()
        return session_id

    def is_active(self, session_id: str, user_id: int) -> bool:
        """Check a session from a JWT.

        Args:
            session_id (str): the "sid" of the JWT.
            user_id (int): the "sub" of the JWT, the session must be theirs.

        Returns:
            bool: True if the session exists, belongs to the user and hasn't
            expired.
        """
        with Session(self.engine) as sess:
            stmt = select(UserSession.id).where(
                UserSession.id == session_id,
                UserSession.user_id == user_id,
                UserSession.expires_at > func.now(),
            )
            return sess.scalar(stmt) is not None

    def delete_session(self, session_id: str) -> None:
        """Close a session (logout). Does nothing if session doesn't exist."""
        with Session(self.engine) as sess:
            sess.execute(delete(UserSession).where(UserSession.id == session_id))
            sess.commit()


sessions_db: SessionRequest = SessionRequest(engine)
