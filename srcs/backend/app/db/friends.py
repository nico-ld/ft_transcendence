"""Friend requests a row is user_id asked friend_id to be friends

Two users are friends when both asked each other so accepting a request is
asking back. Deleting a user deletes their rows (ON DELETE CASCADE in postgres)
"""

from sqlalchemy import Engine, ForeignKey, delete, or_, select, tuple_
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Mapped, Session, mapped_column

from .connection import Base, engine


class FriendRequest(Base):
    __tablename__ = "friend_requests"

    # the primary key is the pair so asking twice cant make a second row
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    friend_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True, index=True
    )

    def __repr__(self) -> str:
        return f"FriendRequest {self.user_id} -> {self.friend_id}"


class FriendsRequest:
    engine: Engine

    def __init__(self, engine: Engine) -> None:
        self.engine = engine

    def add(self, user_id: int, friend_id: int) -> bool:
        """user_id asks friend_id or accepts their request

        Returns:
            bool: True if friend_id asked too, so they are friends now

        Raises:
            IntegrityError: one of the users doesn't exist
        """
        with Session(self.engine) as sess:
            sess.execute(
                insert(FriendRequest)
                .values(user_id=user_id, friend_id=friend_id)
                .on_conflict_do_nothing()
            )
            sess.commit()
            return sess.get(FriendRequest, (friend_id, user_id)) is not None

    def remove(self, a: int, b: int) -> bool:
        """Delete the requests between two users, both ways

        Returns:
            bool: False if there was none.
        """
        with Session(self.engine) as sess:
            result = sess.execute(
                delete(FriendRequest).where(
                    tuple_(FriendRequest.user_id, FriendRequest.friend_id).in_(
                        [(a, b), (b, a)]
                    )
                )
            )
            sess.commit()
            return result.rowcount > 0

    def requests(self, user_id: int) -> tuple[set[int], set[int]]:
        """Ids of the users user_id asked, and of the users who asked user_id"""
        sent: set[int] = set()
        received: set[int] = set()
        with Session(self.engine) as sess:
            rows = sess.execute(
                select(FriendRequest.user_id, FriendRequest.friend_id).where(
                    or_(
                        FriendRequest.user_id == user_id,
                        FriendRequest.friend_id == user_id,
                    )
                )
            )
            for asker, asked in rows:
                if asker == user_id:
                    sent.add(asked)
                else:
                    received.add(asker)
        return sent, received


friends_db: FriendsRequest = FriendsRequest(engine)
