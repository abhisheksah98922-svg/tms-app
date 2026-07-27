import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    ENV: str = "development"
    PROJECT_NAME: str = "TMS - Transport Management System"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./tms.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Security
    JWT_SECRET: str = "super-secret-jwt-key-change-in-production-min-32-chars"
    JWT_REFRESH_SECRET: str = "super-secret-jwt-refresh-key-change-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Providers / Drivers
    STORAGE_DRIVER: str = "local"
    NOTIFICATION_PROVIDER: str = "mock"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
