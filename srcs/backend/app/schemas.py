from datetime import datetime
from typing import Annotated

from db import Role
from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
)
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base for API schemas: snake_case in Python, camelCase in the JSON"""

    # from_attributes lets UserOut.model_validate(user) read a SQLAlchemy User directly
    model_config = ConfigDict(
        alias_generator=to_camel, validate_by_name=True, from_attributes=True
    )


# emails are stored in lowercase, so Robert67@robert.io and robert67@robert.io
# are the same account
Email = Annotated[EmailStr, AfterValidator(str.lower)]
Name = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)
]


class UserOut(CamelModel):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    avatar: str | None
    job: str | None
    role: Role
    created_at: datetime


class SignupIn(CamelModel):
    # unknown keys (role, id, ...) are denied with a 422 instead of being ignored
    model_config = ConfigDict(extra="forbid")

    username: Name
    first_name: Name
    last_name: Name
    email: Email
    password: str = Field(min_length=8, max_length=128)


class LoginIn(CamelModel):
    model_config = ConfigDict(extra="forbid")

    email: Email
    # no min length here because that rule is for signup
    # login only compares with the hash
    password: str = Field(min_length=1, max_length=128)
