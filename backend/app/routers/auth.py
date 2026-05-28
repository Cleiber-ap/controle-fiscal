from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.usuario import Usuario
from app.auth.senha import verificar_senha
from app.auth.jwt import criar_token

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    senha: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    usuario_id: int
    nome: str
    perfil: str
    permissoes: dict

@router.post("/login", response_model=TokenResponse)
def login(dados: LoginRequest, db: Session = Depends(get_db)):
    # Buscar usuário pelo email
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    if not verificar_senha(dados.senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos"
        )
    
    if not usuario.ativo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuário inativo"
        )
    
    # Gerar token JWT
    token = criar_token({"sub": usuario.email})
    
    # Montar permissões
    permissoes = {}
    for perm in usuario.permissoes:
        permissoes[perm.modulo] = {
            "visualizar": perm.visualizar,
            "editar": perm.editar,
            "incluir": perm.incluir,
            "apagar": perm.apagar,
        }
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario_id": usuario.id,
        "nome": usuario.nome,
        "perfil": usuario.perfil,
        "permissoes": permissoes,
    }