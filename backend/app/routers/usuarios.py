from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.usuario import Usuario
from app.models.permissao import Permissao
from app.auth.jwt import get_current_user
from app.auth.senha import hash_senha

router = APIRouter()

class UsuarioSchema(BaseModel):
    nome: str
    email: str
    perfil: Optional[str] = 'Fiscal'
    senha: Optional[str] = None

class PermissoesSchema(BaseModel):
    permissoes: dict

@router.get("/")
def listar_usuarios(db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    usuarios = db.query(Usuario).filter(Usuario.ativo == True).all()
    result = []
    for u in usuarios:
        perms = {}
        for p in u.permissoes:
            perms[p.modulo] = {
                "visualizar": p.visualizar,
                "editar": p.editar,
                "incluir": p.incluir,
                "apagar": p.apagar,
            }
        result.append({
            "id": u.id,
            "nome": u.nome,
            "email": u.email,
            "perfil": u.perfil,
            "ativo": u.ativo,
            "permissoes": perms,
        })
    return result

@router.post("/", status_code=201)
def criar_usuario(dados: UsuarioSchema, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    if not dados.senha:
        raise HTTPException(status_code=400, detail="Senha obrigatória para novo usuário")
    existing = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    novo = Usuario(
        nome=dados.nome,
        email=dados.email,
        perfil=dados.perfil,
        senha_hash=hash_senha(dados.senha),
    )
    db.add(novo)
    db.commit()
    db.refresh(novo)
    # Criar permissões padrão (só visualizar)
    modulos = ['dashboard','inicio','notas','impostos','contab','rel','empresas','usuarios','xml','exp']
    for modulo in modulos:
        perm = Permissao(usuario_id=novo.id, modulo=modulo, visualizar=True)
        db.add(perm)
    db.commit()
    return {"id": novo.id, "nome": novo.nome, "email": novo.email, "perfil": novo.perfil}

@router.put("/{id}")
def editar_usuario(id: int, dados: UsuarioSchema, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    u = db.query(Usuario).filter(Usuario.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    u.nome = dados.nome
    u.email = dados.email
    u.perfil = dados.perfil
    if dados.senha:
        u.senha_hash = hash_senha(dados.senha)
    db.commit()
    return {"id": u.id, "nome": u.nome, "email": u.email, "perfil": u.perfil}

@router.put("/{id}/permissoes")
def salvar_permissoes(id: int, dados: PermissoesSchema, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    u = db.query(Usuario).filter(Usuario.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    for modulo, acoes in dados.permissoes.items():
        perm = db.query(Permissao).filter(Permissao.usuario_id == id, Permissao.modulo == modulo).first()
        if perm:
            perm.visualizar = acoes.get("visualizar", False)
            perm.editar = acoes.get("editar", False)
            perm.incluir = acoes.get("incluir", False)
            perm.apagar = acoes.get("apagar", False)
        else:
            nova = Permissao(
                usuario_id=id, modulo=modulo,
                visualizar=acoes.get("visualizar", False),
                editar=acoes.get("editar", False),
                incluir=acoes.get("incluir", False),
                apagar=acoes.get("apagar", False),
            )
            db.add(nova)
    db.commit()
    return {"message": "Permissões salvas com sucesso"}

@router.delete("/{id}")
def remover_usuario(id: int, db: Session = Depends(get_db), usuario = Depends(get_current_user)):
    u = db.query(Usuario).filter(Usuario.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    u.ativo = False
    db.commit()
    return {"message": "Usuário removido"}

@router.put("/{usuario_id}/senha")
def alterar_senha(usuario_id: int, dados: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if current_user.id != usuario_id and current_user.perfil != "admin":
        raise HTTPException(status_code=403, detail="Sem permissão")
    senha_atual = dados.get("senha_atual", "")
    nova_senha = dados.get("nova_senha", "")
    if not verify_password(senha_atual, usuario.senha_hash):
        raise HTTPException(status_code=400, detail="Senha atual incorreta")
    if len(nova_senha) < 6:
        raise HTTPException(status_code=400, detail="Nova senha deve ter ao menos 6 caracteres")
    usuario.senha_hash = get_password_hash(nova_senha)
    db.commit()
    return {"ok": True}

