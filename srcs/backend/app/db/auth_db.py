from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import ARRAY, JSON, String

from .connection import Base, engine


class employee_creds(Base):
    __tablename__ = "Employee_creds"

    userid: Mapped[int] = mapped_column(ForeignKey("User_account.id"), primary_key=True)
    oauth: Mapped[JSON] = mapped_column(JSON)
    #organisation: Mapped[]
    friendship: Mapped[list[int]] = mapped_column(ARRAY(Integer))
    job_image: Mapped[str] = mapped_column(String(512))
    notification: Mapped[str] = mapped_column(String(512))
    #environment: Mapped[?] = mapped_column(?)

    def __repr__(self) -> str:
        return f"id:{self.userid}, job_image: {self.job_image}"


employee_creds.metadata.create_all(engine)