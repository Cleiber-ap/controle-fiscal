const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== SPAN ORIGINAL ===");
let i = c.indexOf("pulsando.has(contbId)");
console.log(JSON.stringify(c.substring(i-250, i+250)));
console.log("=== SPAN PARCIAL ===");
i = c.indexOf('pulsando.has("pgto-" + pg.id)');
console.log(JSON.stringify(c.substring(i-250, i+250)));
