const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = 'const isCancelada = String(row[8]||"").includes("/Cancelada")';
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = 'const isCancelada = String(row[8]||"").includes("/Cancelada") || String(row[8]||"").includes("/Entrada")';
  c = c.replace(anchor, novo);
  console.log("OK - linhas Venda/Entrada tambem ficam vermelhas no relatorio");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
