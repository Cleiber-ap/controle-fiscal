const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  'a.download = "Relatorio_Saidas_SIX_e_ENOVA.xlsx"',
  'a.download = "Relatorio_Saidas_SIX_e_ENOVA " + mesAntNome + anoAnt + ".xlsx"'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("mesAntNome + anoAnt") ? "OK" : "FALHOU");
