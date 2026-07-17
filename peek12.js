const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("const tPago = notas.filter");
const chunk = c.substring(i, i+1000);
chunk.split("\r\n").forEach(l => console.log(JSON.stringify(l)));
