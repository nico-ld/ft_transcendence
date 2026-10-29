import base64
import binascii
import re
from datetime import datetime
from typing import Annotated, Self

from db import Job, Role
from pydantic import (
    AfterValidator,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
    model_validator,
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
# same rule as the sign up form; "-" because 42 logins have it and become usernames
Username = Annotated[
    str, StringConstraints(strip_whitespace=True, pattern=r"^[a-zA-Z0-9_-]{3,20}$")
]
# what the profile page sends: the image resized to 256px by a canvas, in base64
AVATAR_DATA_URL = re.compile(
    r"data:image/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})"
)
# ~110 KB once decoded, the front sends ~30 KB
AVATAR_MAX_LENGTH = 150_000


def is_image(kind: str, data: bytes) -> bool:
    """Checks the first bytes, so a file that only claims to be an image is refused"""
    if kind == "png":
        return data.startswith(b"\x89PNG\r\n\x1a\n")
    if kind == "jpeg":
        return data.startswith(b"\xff\xd8\xff")
    return data[:4] == b"RIFF" and data[8:12] == b"WEBP"


class UserOut(CamelModel):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    avatar: str | None
    job: Job | None
    role: Role
    created_at: datetime
    has_password: bool
    is_guest: bool


class UserCreateIn(CamelModel):
    model_config = ConfigDict(extra="forbid")

    username: Username
    first_name: Name
    last_name: Name
    email: Email
    password: str = Field(min_length=8, max_length=128)
    job: Job | None
    role: Role


class SignupIn(CamelModel):
    # unknown keys (role, id, ...) are denied with a 422
    model_config = ConfigDict(extra="forbid")

    username: Username
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


class UserUpdateIn(CamelModel):
    """Admin edit of a user"""

    model_config = ConfigDict(extra="forbid")

    username: Username | None = None
    first_name: Name | None = None
    last_name: Name | None = None
    job: Job | None = None
    role: Role | None = None

    @model_validator(mode="after")
    def only_job_can_be_null(self) -> Self:
        for field in ("username", "first_name", "last_name", "role"):
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} can't be null")
        return self


class ProfileUpdateIn(CamelModel):
    """Edit user profile"""

    model_config = ConfigDict(extra="forbid")

    username: Username | None = None
    first_name: Name | None = None
    last_name: Name | None = None
    avatar: str | None = Field(default=None, max_length=AVATAR_MAX_LENGTH)

    @model_validator(mode="after")
    def avatar_verification(self) -> Self:
        # not sent, or null to go back to the default avatar
        if self.avatar is None:
            return self
        match = AVATAR_DATA_URL.fullmatch(self.avatar)
        if match is None:
            raise ValueError("avatar must be a png, jpeg or webp data URL")
        kind, payload = match.groups()
        try:
            data = base64.b64decode(payload, validate=True)
        except binascii.Error:
            raise ValueError("avatar is not valid base64") from None
        if not is_image(kind, data):
            raise ValueError(f"avatar is not a {kind} image")
        return self


class WorkspaceMetrics(CamelModel):
    user_id: int
    cpu_usage_percent: float
    memory_usage_percent: float
    memory_used_mb: float
    memory_total_mb: float
    network_rx_kbps: float | None = None
    network_tx_kbps: float | None = None
    uptime_seconds: float | None = None


class PasswordChangeIn(CamelModel):
    """The logged in user changes their own password"""

    model_config = ConfigDict(extra="forbid")

    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class MemoryOut(CamelModel):
    """RAM of the workspace in GB"""

    used_gb: float
    total_gb: float
    path: str


class LogTimeOut(CamelModel):
    """Time with a terminal open, as "22h12" """

    week: str
    month: str


class StatsOut(CamelModel):
    """User stats"""

    memory: MemoryOut
    log_time: LogTimeOut
    # hours with a terminal open each day of this week
    daily: list[float]
