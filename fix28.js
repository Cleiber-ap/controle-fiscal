const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "  const mesAtualNomeCtb = MESES[new Date().getMonth()]\n  const mesAtualStrCtb = mesAtualNomeCtb.toLowerCase() + '/' + new Date().getFullYear()",
  "  const mesAtualStrCtb = MESES[mesAntIdx].toLowerCase() + '/' + anoAnt"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("MESES[mesAntIdx].toLowerCase()") ? "OK" : "FALHOU");
