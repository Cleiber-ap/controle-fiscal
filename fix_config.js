const fs = require('fs');
fs.writeFileSync('C:/projetos/controle-fiscal/backend/app/database.py',
`import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://fiscal_user:fiscal2026@localhost:5432/controle_fiscal")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
`, 'utf8');
console.log('ok');