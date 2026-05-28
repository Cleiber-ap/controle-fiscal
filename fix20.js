const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  'XLSXStyle.writeFile(wb, "relatorio_completo.xlsx")',
  'const wbout = XLSXStyle.write(wb, { bookType: "xlsx", type: "array" })\n    const blob = new Blob([wbout], { type: "application/octet-stream" })\n    const url = URL.createObjectURL(blob)\n    const a = document.createElement("a"); a.href = url; a.download = "relatorio_completo.xlsx"; a.click()\n    URL.revokeObjectURL(url)'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("wbout") && !c.includes('writeFile(wb') ? "OK" : "FALHOU");
