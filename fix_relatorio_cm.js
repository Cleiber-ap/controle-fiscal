const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Adicionar busca da CM no useEffect
c = c.replace(
  "historicoAPI.listar(1).then(r => r.data).catch(() => []),\n      historicoAPI.listar(2).then(r => r.data).catch(() => []),",
  "historicoAPI.listar(1).then(r => r.data).catch(() => []),\n      historicoAPI.listar(2).then(r => r.data).catch(() => []),\n      historicoAPI.listar(3).then(r => r.data).catch(() => []),"
);

// Adicionar histCm na desestruturação
c = c.replace(
  "const [histSix, histEnova, dasSix, dasEnova]",
  "const [histSix, histEnova, histCm, dasSix, dasEnova]"
);

// Incluir CM no cálculo por ano
c = c.replace(
  "six: histSix.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),\n    enova: histEnova.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),",
  "six: histSix.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),\n    enova: histEnova.filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),\n    cm: (histCm||[]).filter(r => r.ano === ano).reduce((s, r) => s + r.valor, 0),"
);

// Incluir CM no total de cada ano
c = c.replace(
  /total: (\w+\.six \+ \w+\.enova)/g,
  "total: $1 + ($1.replace('six + ', '').replace(/(\\w+)\\.enova/, '$1.cm') ? 0 : 0) + (dadoAno ? dadoAno.cm || 0 : 0)"
);

// Abordagem mais simples: recalcular o total incluindo cm
c = c.replace(
  "total: d.six + d.enova",
  "total: d.six + d.enova + (d.cm || 0)"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("histCm") && c.includes("d.cm || 0");
console.log(ok ? "OK" : "FALHOU");
