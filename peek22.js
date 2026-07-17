const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("const nfsAberto = notas.filter");
console.log(JSON.stringify(c.substring(i, i+180)));
