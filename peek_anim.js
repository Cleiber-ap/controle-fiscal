const fs = require("fs");
const c = fs.readFileSync("C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx", "utf8");
console.log("=== antes de export default ===");
let i = c.indexOf("export default function Contabilidade()");
console.log(JSON.stringify(c.substring(i-60, i+50)));
console.log("=== bloco dos 3 cards ===");
i = c.indexOf("{ label: 'Total em NFs'");
console.log(JSON.stringify(c.substring(i-20, i+750)));
