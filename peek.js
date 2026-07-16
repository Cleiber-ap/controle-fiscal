const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("ajustadosPg[pg.id]");
console.log(JSON.stringify(c.substring(i-500, i+100)));
