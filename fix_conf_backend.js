const fs = require("fs");
const f = "C:/projetos/controle-fiscal/backend/app/routers/usuarios.py";
let c = fs.readFileSync(f, "utf8");

// Adicionar endpoint PUT /usuarios/{id}/senha no final do arquivo (antes do ultimo newline)
const newEndpoint = `

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
`;

if (!c.includes("/{usuario_id}/senha")) {
  c = c.trimEnd() + newEndpoint + "\n";
  fs.writeFileSync(f, c, "utf8");
  console.log("OK - endpoint adicionado");
} else {
  console.log("OK - endpoint ja existe");
}
