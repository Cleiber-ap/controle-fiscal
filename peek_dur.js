const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx", "utf8");
console.log("Ocorrencias dur = 900:", (c.match(/dur = 900/g) || []).length);
console.log("Ocorrencias dur = 800:", (c.match(/dur = 800/g) || []).length);
