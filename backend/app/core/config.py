from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Lotes API"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/sc_app"
    uploads_dir: str = "backend/uploads"
    admin_username: str = "admin"
    admin_password: str = "admin123"
    auth_secret: str = "change-this-secret"
    auth_token_ttl_minutes: int = 60 * 8

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
