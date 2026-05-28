const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Faturamento historico: usar mes anterior
c = c.replace(
  "const vSix = h1.find((r: any) => r.ano === anoAtual && r.mes === mesAtualIdx + 1)?.valor || 0",
  "const vSix = h1.find((r: any) => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0"
);
c = c.replace(
  "const vEnova = h2.find((r: any) => r.ano === anoAtual && r.mes === mesAtualIdx + 1)?.valor || 0",
  "const vEnova = h2.find((r: any) => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0"
);
c = c.replace(
  "const vSixMes = histSix.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)?.valor || 0",
  "const vSixMes = histSix.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0"
);
c = c.replace(
  "const vEnovaMes = histEnova.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)?.valor || 0",
  "const vEnovaMes = histEnova.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)?.valor || 0"
);

// Regime de Caixa: mes lancamento do mes anterior
c = c.replace(
  "const mesAtualStr = mesAtualNome.toLowerCase() + '/' + anoAtual",
  "const mesAtualStr = mesAntNome.toLowerCase() + '/' + anoAnt"
);

// DAS confirmado: mes anterior
c = c.replace(
  "const dasSixConf = dasSix.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)",
  "const dasSixConf = dasSix.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)"
);
c = c.replace(
  "const dasEnovaConf = dasEnova.find(r => r.ano === anoAtual && r.mes === mesAtualIdx + 1)",
  "const dasEnovaConf = dasEnova.find(r => r.ano === anoAnt && r.mes === mesAntIdx + 1)"
);

// Labels no JSX
c = c.replace(
  "Fiscal — DAS / Simples Nacional (base: NFs de Venda {mesAtualNome}/{anoAtual})",
  "Fiscal — DAS / Simples Nacional (base: NFs de Venda {mesAntNome}/{anoAnt})"
);
c = c.replace(
  "💰 Imposto a Pagar — Total ({mesAtualNome}/{anoAtual})",
  "💰 Imposto a Pagar — Total ({mesAntNome}/{anoAnt})"
);
c = c.replace(
  "DAS confirmado — {mesAtualNome}/{anoAtual}",
  "DAS confirmado — {mesAntNome}/{anoAnt}"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("mesAntIdx + 1)?.valor") && c.includes("mesAntNome.toLowerCase()");
console.log(ok ? "OK" : "FALHOU");
