const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx", "utf8");
const matches = [...c.matchAll(/nfsCan\.has\(n\.numero_nf\)\?"\\\/Cancelada":""/g)];
console.log("Ocorrencias:", matches.length);
matches.forEach(m => console.log(JSON.stringify(c.substring(m.index-60, m.index+80))));
