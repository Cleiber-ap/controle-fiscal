const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "a.download = \"relatorio_completo.xlsx\"",
  "a.download = \"Relatorio_Saidas_SIX_e_ENOVA.xlsx\""
);
c = c.replace(
  "📋 Relatório Completo — ${mesAntNome}/${anoAnt}",
  "📋 Relatório Saídas SIX e ENOVA — ${mesAntNome}/${anoAnt}"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("Relatorio_Saidas_SIX_e_ENOVA") && c.includes("Relatório Saídas SIX e ENOVA");
console.log(ok ? "OK" : "FALHOU");
