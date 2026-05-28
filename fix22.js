const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  'const a = document.createElement("a"); a.href = url; a.download = "relatorio_completo.xlsx"; a.click()',
  'const a = document.createElement("a"); a.href = url; a.download = "relatorio_completo.xlsx"; document.body.appendChild(a); a.click(); document.body.removeChild(a)'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("appendChild(a)") ? "OK" : "FALHOU");
