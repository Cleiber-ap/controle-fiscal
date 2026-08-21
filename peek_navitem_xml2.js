const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx", "utf8");
const matches = [...c.matchAll(/Importar XML/g)];
console.log("Ocorrencias:", matches.length);
matches.forEach(m => console.log(JSON.stringify(c.substring(m.index-70, m.index+30))));
