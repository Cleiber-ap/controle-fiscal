const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx", "utf8");
const i = c.indexOf("Custo Total Empresa");
console.log(JSON.stringify(c.substring(i+250, i+500)));
