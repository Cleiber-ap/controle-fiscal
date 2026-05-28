const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
const newfn = fs.readFileSync("C:/projetos/controle-fiscal/newfn.txt", "utf8");
// Trocar import xlsx -> xlsx-js-style e alias XLSXStyle
c = c.replace("import * as XLSX from 'xlsx'", "import * as XLSX from 'xlsx'\nimport * as XLSXStyle from 'xlsx-js-style'");
// Substituir funcao
const start = c.indexOf("  async function exportarMesAnterior() {");
const end = c.indexOf("  async function exportarNotas(", start);
if(start===-1||end===-1){console.log("MARKERS NOT FOUND");process.exit(1);}
c = c.slice(0,start) + newfn + "\n\n" + c.slice(end);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("XLSXStyle")&&c.includes("FFC000")&&c.includes("ECECEC") ? "OK" : "FALHOU");
