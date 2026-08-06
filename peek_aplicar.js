const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const matches = [...c.matchAll(/>Aplicar<\/button>/g)];
console.log("Ocorrencias:", matches.length);
