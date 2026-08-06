const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i = c.indexOf("if (val && pg.dt_pagamento && val !== pg.dt_pagamento");
console.log(JSON.stringify(c.substring(i-50, i+500)));
