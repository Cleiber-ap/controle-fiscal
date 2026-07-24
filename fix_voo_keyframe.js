const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Remover o keyframe voarEntrada de dentro do bloco skeleton (so existe durante loading)
const anchorRemover = " @keyframes voarEntrada { from { transform: translateX(-10px); opacity: 0.3 } to { transform: translateX(0); opacity: 1 } }";
const idxRemover = c.indexOf(anchorRemover);
if (idxRemover === -1) { console.log("FALHOU: anchorRemover"); ok = false; }
else {
  c = c.slice(0, idxRemover) + c.slice(idxRemover + anchorRemover.length);
  console.log("OK: keyframe removido do bloco skeleton");
}

// 2. Adicionar no bloco fadeInTabela (que existe sempre que a tabela esta visivel)
const anchor2 = "@keyframes fadeInTabela { from { opacity: 0.2 } to { opacity: 1 } }";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  c = c.replace(anchor2, anchor2 + " @keyframes voarEntrada { from { transform: translateX(-10px); opacity: 0.3 } to { transform: translateX(0); opacity: 1 } }");
  console.log("OK: keyframe adicionado no bloco fadeInTabela (permanente)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
