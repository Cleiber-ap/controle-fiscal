const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const matches = [...c.matchAll(/<td style=\{tdSm\(\{ color: '#4A5070', \.\.\.mono, fontSize: '11px' \}\)\}>\{fmtCNPJ\(r\.cnpj_dest\)\}<\/td>/g)];
console.log("Ocorrencias:", matches.length);
matches.forEach(m => console.log(JSON.stringify(m[0])));
