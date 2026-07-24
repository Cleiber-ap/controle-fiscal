const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== FIM BOTAO COPIAR ORIGINAL ===");
let i = c.indexOf("Copiar data de pagamento");
console.log(JSON.stringify(c.substring(i+700, i+1200)));
console.log("=== BOTAO COPIAR PARCIAL ===");
i = c.indexOf("!pg.data_contabilizacao && pg.dt_pagamento");
console.log(JSON.stringify(c.substring(i-30, i+700)));
