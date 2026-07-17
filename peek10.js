const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
const i1 = c.indexOf("const now2 = new Date(); const mesCont");
console.log("=== BLOCO ORIGINAL ===");
console.log(JSON.stringify(c.substring(i1-350, i1+400)));
const i2 = c.indexOf("if (mm === mesAntIdx + 1 && aa === anoAnt && pg.valor_pago > 0)");
console.log("=== BLOCO PARCIAL ===");
console.log(JSON.stringify(c.substring(i2-350, i2+300)));
