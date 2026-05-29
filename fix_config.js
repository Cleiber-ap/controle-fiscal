const fs = require('fs');

// Remove env_file do config.py
const configPath = 'C:/projetos/controle-fiscal/backend/app/config.py';
const content = `from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    refresh_token_expire_days: int = 7

settings = Settings()
`;
fs.writeFileSync(configPath, content, 'utf8');
console.log('ok');