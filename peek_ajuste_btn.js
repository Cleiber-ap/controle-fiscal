const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== BOTAO AJUSTE ORIGINAL ===");
let i = c.indexOf("const val = !(r.ajustado || false)");
console.log(JSON.stringify(c.substring(i-100, i+650)));
console.log("=== ONBLUR ORIGINAL (regra auto) ===");
i = c.indexOf("const dtPgtoRef1 = temHistorico");
console.log(JSON.stringify(c.substring(i, i+500)));
