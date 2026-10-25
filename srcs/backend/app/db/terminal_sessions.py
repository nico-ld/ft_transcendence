from datetime import datetime, timedelta

from sqlalchemy import DateTime, Engine, ForeignKey, delete, func, select, update
from sqlalchemy.orm import Mapped, Session, mapped_column

from .connection import Base, engine

# rows are deleted after x days
KEEP_FOR = timedelta(days=62)


class TerminalSession(Base):
    __tablename__ = "terminal_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    # postgres will del the terminal sessions if the user is deleted
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return (
            f"Terminal of user {self.user_id}, "
            f"from {self.started_at} to {self.last_seen_at}"
        )


class TerminalSessionRequest:
    engine: Engine

    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def open(self, user_id: int) -> int:
        """Start counting the log time of a terminal
        Also deletes the rows too old for the dashboard

        Args:
            user_id (int): the user ID

        Returns:
            int: the ID of the row
        """
        with Session(self.engine) as sess:
            sess.execute(
                delete(TerminalSession).where(
                    TerminalSession.last_seen_at < func.now() - KEEP_FOR
                )
            )
            row = TerminalSession(user_id=user_id)
            sess.add(row)
            sess.commit()
            return row.id

    def touch(self, terminal_id: int) -> None:
        """Extend its log time to now"""
        with Session(self.engine) as sess:
            sess.execute(
                update(TerminalSession)
                .where(TerminalSession.id == terminal_id)
                .values(last_seen_at=func.now())
            )
            sess.commit()

    def intervals(
        self, user_id: int, since: datetime
    ) -> list[tuple[datetime, datetime]]:
        """The (start, end) of the terminals of a user still open after since

        Args:
            user_id (int): the user ID
            since (datetime): gets rows after since

        Returns:
            list[tuple[datetime, datetime]]: may overlap if the user had multiple
            open terminals
        """
        with Session(self.engine) as sess:
            rows = sess.execute(
                select(TerminalSession.started_at, TerminalSession.last_seen_at).where(
                    TerminalSession.user_id == user_id,
                    TerminalSession.last_seen_at > since,
                )
            )
            return [(start, end) for start, end in rows]


terminal_sessions_db: TerminalSessionRequest = TerminalSessionRequest(engine)
