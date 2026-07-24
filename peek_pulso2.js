const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== FIM ONBLUR ORIGINAL + SPAN ===");
let i = c.indexOf("setEditandoContb(null)");
console.log(JSON.stringify(c.substring(i-20, i+700)));
console.log("=== ONBLUR PARCIAL ===");
i = c.indexOf('editandoContb === ("pgto-" + pg.id)');
console.log(JSON.stringify(c.substring(i-50, i+1600)));
