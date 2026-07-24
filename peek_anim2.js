const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("{ label: 'Total em NFs'");
console.log(JSON.stringify(c.substring(i+750, i+1150)));
