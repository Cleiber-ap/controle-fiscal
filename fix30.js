const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");

// DAS confirmado deve buscar no mes ATUAL (quando eh pago), nao no mes anterior
c = c.replace(
  "const dasSixConf = dasSix.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)",
  "const dasSixConf = dasSix.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)"
);
c = c.replace(
  "const dasEnovaConf = dasEnova.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)",
  "const dasEnovaConf = dasEnova.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)"
);

// Label do DAS confirmado tambem volta para mes atual
c = c.replace(
  "DAS confirmado — {mesAntNome}/{anoAnt}",
  "DAS confirmado — {mesAtualNome}/{anoAtual}"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("anoAtual && r.mes === mesAtualIdx + 1") ? "OK" : "FALHOU");
