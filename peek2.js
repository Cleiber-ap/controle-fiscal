const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("pg.dt_pagamento");
console.log(JSON.stringify(c.substring(i-100, i+300)));
