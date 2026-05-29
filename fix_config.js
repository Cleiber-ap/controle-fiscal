const fs = require('fs');

fs.writeFileSync('C:/projetos/controle-fiscal/backend/app/config.py', 
`import os

class Settings:
    database_url = os.environ.get("DATABASE_URL", "")
    secret_key = os.environ.get("SECRET_KEY", "")
    algorithm = os.environ.get("ALGORITHM", "HS256")
    access_token_expire_minutes = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
    refresh_token_expire_days = int(os.environ.get("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

settings = Settings()
`, 'utf8');

console.log('config.py ok');