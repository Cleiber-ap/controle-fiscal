const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx", "utf8");
console.log("=== export default ===");
let i = c.indexOf("export default function");
console.log(JSON.stringify(c.substring(i, i+50)));
console.log("=== bloco render ===");
i = c.indexOf("Custo Total Empresa");
console.log(JSON.stringify(c.substring(i-150, i+350)));
