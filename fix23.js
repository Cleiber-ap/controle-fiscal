const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Adicionar console.log apos write e delay antes de revogar URL
c = c.replace(
  'const wbout = XLSXStyle.write(wb, { bookType: "xlsx", type: "array" })\n    const blob = new Blob([wbout], { type: "application/octet-stream" })\n    const url = URL.createObjectURL(blob)\n    const a = document.createElement("a"); a.href = url; a.download = "relatorio_completo.xlsx"; document.body.appendChild(a); a.click(); document.body.removeChild(a)\n    URL.revokeObjectURL(url)',
  'const wbout = XLSXStyle.write(wb, { bookType: "xlsx", type: "array" })\n    console.log("WBOUT_SIZE:", wbout?.byteLength)\n    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })\n    const url = URL.createObjectURL(blob)\n    const a = document.createElement("a"); a.href = url; a.download = "relatorio_completo.xlsx"; document.body.appendChild(a); a.click()\n    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 2000)'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("WBOUT_SIZE") && c.includes("setTimeout") ? "OK" : "FALHOU");
