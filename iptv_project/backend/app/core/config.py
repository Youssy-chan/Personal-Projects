from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_ENV: str = "dev"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    REQUEST_TIMEOUT: int = 12
    MAX_RETRIES: int = 2
    CACHE_TTL_SECONDS: int = 120
    VERIFY_SSL: bool = True
    DEFAULT_USER_AGENT: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    PLAYLIST_OUTPUT_DIR: str = "./output"
    ENABLE_SCHEDULED_REFRESH: bool = True
    REFRESH_CATALOG_CRON: str = "*/15 * * * *"
    REFRESH_STREAMS_CRON: str = "*/5 * * * *"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
