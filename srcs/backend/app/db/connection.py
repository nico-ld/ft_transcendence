import enum
from datetime import datetime

from config import settings
from sqlalchemy import (
    CheckConstraint,
    DateTime,
    String,
    create_engine,
    func,
)
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Role(enum.Enum):
    ADMIN = "admin"
    ACCOUNTANT = "accountant"
    DATA = "data-analyst"
    DEVOPS_INGE = "devops"
    SOFTWARE_INGE = "software-engineer"
    TECH_WRITER = "technical-writer"


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        # every account needs at least one way to log in
        CheckConstraint(
            "password_hash IS NOT NULL OR ft_id IS NOT NULL",
            name="users_has_login_method",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    # None for accounts that only log in with 42
    password_hash: Mapped[str | None] = mapped_column(String)
    # 42 user id, None for accounts that only log in with email/password
    ft_id: Mapped[int | None] = mapped_column(unique=True)
    # display name only, not used to log in
    username: Mapped[str] = mapped_column(String)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    avatar: Mapped[str | None] = mapped_column(String, nullable=True)
    job: Mapped[str | None] = mapped_column(String)
    # values_callable stores the enum values ("admin") instead of the names ("ADMIN")
    role: Mapped[Role] = mapped_column(
        SAEnum(Role, name="user_role", values_callable=lambda e: [m.value for m in e]),
        nullable=False,
        default=Role.DEV,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"ID: {self.id}, User: {self.first_name}, Role: {self.role!r}"


engine = create_engine(settings.database_url)
