const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== notasFiltradas2 ===");
let i = c.indexOf("const notasFiltradas2 = filtroMesEmissao");
console.log(JSON.stringify(c.substring(i, i+500)));
console.log("=== SELECT ===");
i = c.indexOf("<select value={filtroMesEmissao}");
console.log(JSON.stringify(c.substring(i, i+900)));
