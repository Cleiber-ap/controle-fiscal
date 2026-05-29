const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/backend/app/config.py';
const content = `from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    refresh_token_expire_days: int = 7

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
`;
fs.writeFileSync(f, content, 'utf8');
console.log('ok');