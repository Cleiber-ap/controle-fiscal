const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/backend/app/routers/notas.py", "utf8");
const i = c.indexOf("dt_pagamento = Column(String(30)");
console.log(JSON.stringify(c.substring(i-50, i+120)));
