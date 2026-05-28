const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Titulo
c = c.replace(
  "Evolução Mensal — Últimos 24 meses",
  "Evolução Mensal — Últimos 3 Anos (SIX + ENOVA + CM)"
);

// Legenda com anos
c = c.replace(
  "{[{ cor: '#4F8EF7', l: 'Total', dash: false }, { cor: '#4F8EF7AA', l: 'SIX', dash: true }, { cor: '#34D399AA', l: 'ENOVA', dash: true }].map(e => (",
  "{ultimos3Anos.map((ano, i) => ({ cor: ['#4F8EF7','#34D399','#FBBF24'][i], l: String(ano), dash: false })).map(e => ("
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("Últimos 3 Anos (SIX + ENOVA + CM)") && c.includes("ultimos3Anos.map((ano, i) => ({ cor: ['#4F8EF7'");
console.log(ok ? "OK" : "FALHOU");
