from pathlib import Path

from pydantic import EmailStr, Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import URL


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=Path(__file__).parent.parent / ".env")

    ft_client_id: str
    ft_client_secret: str
    session_secret: str = Field(min_length=32)
    jwt_expire_minutes: int = 60 * 24
    frontend_url: str = "https://localhost"

    # first admin account, created at startup if it doesn't exist yet
    admin_email: EmailStr | None = None
    admin_password: str | None = Field(default=None, min_length=8, max_length=128)

    # same variables as the postgres container (postgres/.env)
    postgres_user: str
    postgres_password: str
    postgres_db: str
    postgres_host: str = "db"
    postgres_port: int = 5432

    # mounted by docker compose, we run the workspaces through it
    docker_url: str = "unix:///var/run/docker.sock"
    workspace_memory_mb: int = 1024
    workspace_cpus: float = 1.0
    workspace_pids: int = 256

    @property
    def database_url(self) -> URL:
        return URL.create(
            "postgresql+psycopg",
            username=self.postgres_user,
            password=self.postgres_password,
            host=self.postgres_host,
            port=self.postgres_port,
            database=self.postgres_db,
        )


settings = Settings()  # pyright: ignore[reportCallIssue]
