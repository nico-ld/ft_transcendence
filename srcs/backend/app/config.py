from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    ft_client_id: str
    ft_client_secret: str
    session_secret: str
    frontend_url: str = "http://localhost:5173"


settings = Settings() # pyright: ignore[reportCallIssue]
