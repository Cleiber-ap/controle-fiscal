const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
const newfn = fs.readFileSync("C:/projetos/controle-fiscal/newfn.txt","utf8");
let c = fs.readFileSync(f,"utf8");
const start = c.indexOf("  async function exportarMesAnterior() {");
const endMarker = "  async function exportarNotas";
const end = c.indexOf(endMarker, start);
if(start===-1||end===-1){console.log("MARKERS NOT FOUND: start="+start+" end="+end);process.exit(1);}
c = c.slice(0,start) + newfn + c.slice(end);
fs.writeFileSync(f,c,"utf8");
console.log(c.includes("ExcelJS")&&c.includes("FFFFC000")?"OK":"FALHOU");
