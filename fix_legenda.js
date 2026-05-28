const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "{[{ cor: '#4F8EF7', l: 'SIX' }, { cor: '#34D399', l: 'ENOVA' }].map(e => (",
  "{(ultimos3Anos||[]).map((ano, i) => ({ cor: ['#4F8EF7','#34D399','#FBBF24'][i], l: String(ano) })).map(e => ("
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("ultimos3Anos||[]") ? "OK" : "FALHOU");
