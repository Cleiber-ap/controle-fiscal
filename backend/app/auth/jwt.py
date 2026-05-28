from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def criar_token(dados: dict, expira_em_minutos: int = None):
    payload = dados.copy()
    expiracao = datetime.utcnow() + timedelta(
        minutes=expira_em_minutos or settings.access_token_expire_minutes
    )
    payload.update({"exp": expiracao})
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

def verificar_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.models.usuario import Usuario
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = verificar_token(token)
    if email is None:
        raise credentials_exception
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if usuario is None:
        raise credentials_exception
    return usuario