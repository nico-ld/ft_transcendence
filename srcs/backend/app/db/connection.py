import enum

from config import settings
from pydantic import BaseModel
from sqlalchemy import Enum as SAEnum
from sqlalchemy import (
	Integer,
	MetaData,
	Sequence,
	String,
	create_engine,
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm.decl_api import DeclarativeBase

USER_ID_SEQ = Sequence('UserID', start=1)

class Roles(enum.Enum):
	Adminstrator = "Administrator"
	Lead_Dev = "Lead_Developer"
	Dev = "Developer"

meta_data = MetaData();

class Base(DeclarativeBase):
	metadata = meta_data

class User(Base):
	__tablename__ = "User_account"

	id: Mapped[int] = mapped_column(
		Integer, USER_ID_SEQ, primary_key=True,
		server_default=USER_ID_SEQ.next_value(),
	)
	name: Mapped[str] = mapped_column(String)
	lastname: Mapped[str] = mapped_column(String)
	email: Mapped[str] = mapped_column(String)
	avatar: Mapped[str | None] = mapped_column(String, nullable=True)
	role: Mapped[Roles] = mapped_column(
		SAEnum(Roles, values_callable=lambda e: [m.value for m in e]),
		nullable=False, default=Roles.Dev,
	)

	def __repr__(self) -> str:
		return f"User:{self.name}, id:{self.id}, role:{self.role!r}"

engine = create_engine(settings.database_url);
User.metadata.create_all(engine)

class UserFront(BaseModel):
	id: int
	name:str
	lastname: str
	email: str
	avatar: str | None
	role: Roles