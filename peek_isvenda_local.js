const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const matches = [...c.matchAll(/nat\.includes\('venda'\)/g)];
console.log("Ocorrencias:", matches.length);
matches.forEach(m => console.log(JSON.stringify(c.substring(m.index-40, m.index+180))));
