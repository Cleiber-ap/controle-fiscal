const fs = require("fs");
const f = "C:/projetos/controle-fiscal/backend/app/routers/notas.py";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "@router.post(\"/ajustes\")\r\n" +
"def criar_ajuste(dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):\r\n" +
"    aj = AjusteDevolucao(\r\n" +
"        empresa_id=dados[\"empresa_id\"],\r\n" +
"        ano=dados[\"ano\"],\r\n" +
"        mes=dados[\"mes\"],\r\n" +
"        valor=dados[\"valor\"],\r\n" +
"        nf_devolucao=dados.get(\"nf_devolucao\"),\r\n" +
"        nf_referenciada=dados.get(\"nf_referenciada\"),\r\n" +
"        chave_ref=dados.get(\"chave_ref\"),\r\n" +
"    )\r\n" +
"    db.add(aj); db.commit(); db.refresh(aj)\r\n";

const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "@router.post(\"/ajustes\")\r\n" +
"def criar_ajuste(dados: dict, db: Session = Depends(get_db), usuario=Depends(get_current_user)):\r\n" +
"    chave_ref = dados.get(\"chave_ref\")\r\n" +
"    empresa_id = dados[\"empresa_id\"]\r\n" +
"    if chave_ref:\r\n" +
"        existente = db.query(AjusteDevolucao).filter(\r\n" +
"            AjusteDevolucao.empresa_id == empresa_id,\r\n" +
"            AjusteDevolucao.chave_ref == chave_ref\r\n" +
"        ).first()\r\n" +
"        if existente:\r\n" +
"            return existente\r\n" +
"    aj = AjusteDevolucao(\r\n" +
"        empresa_id=empresa_id,\r\n" +
"        ano=dados[\"ano\"],\r\n" +
"        mes=dados[\"mes\"],\r\n" +
"        valor=dados[\"valor\"],\r\n" +
"        nf_devolucao=dados.get(\"nf_devolucao\"),\r\n" +
"        nf_referenciada=dados.get(\"nf_referenciada\"),\r\n" +
"        chave_ref=chave_ref,\r\n" +
"    )\r\n" +
"    db.add(aj); db.commit(); db.refresh(aj)\r\n";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - deduplicacao por chave_ref implementada");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
