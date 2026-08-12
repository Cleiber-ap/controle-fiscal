const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "rows.forEach((row:any[], ri:number) => {\r\n" +
"        const bg = ri%2===0 ? \"FFFFFF\" : \"ECECEC\"\r\n" +
"        for(let ci=0;ci<9;ci++){\r\n" +
"          const addr = XLSXStyle.utils.encode_cell({r:ri+1,c:ci})\r\n" +
"          const cellVal = row[ci] ?? \"\"\r\n" +
"          const cellType = cellVal instanceof Date ? \"d\" : typeof cellVal === \"number\" ? \"n\" : \"s\"\r\n" +
"          if(!ws[addr]) ws[addr] = {t:cellType, v:cellVal}\r\n" +
"          else { ws[addr].t = cellType; ws[addr].v = cellVal }\r\n" +
"          const isDate = (ci===5||ci===7) && row[ci] instanceof Date\r\n" +
"          ws[addr].s = { font:{name:\"Calibri\",sz:11}, fill:{patternType:\"solid\",fgColor:{rgb:bg}}, alignment:{horizontal:aligns[ci]||\"left\",vertical:\"center\"}, border }\r\n" +
"          if(isDate) ws[addr].z = \"dd/mm/yyyy\"\r\n" +
"          if(ci===4||ci===6) ws[addr].z = \"_(R$* #,##0.00_);_(R$* (#,##0.00);_(R$* \\\"-\\\"??_);_(@_)\"\r\n" +
"        }\r\n" +
"      })";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "rows.forEach((row:any[], ri:number) => {\r\n" +
"        const bg = ri%2===0 ? \"FFFFFF\" : \"ECECEC\"\r\n" +
"        const isCancelada = String(row[8]||\"\").includes(\"/Cancelada\")\r\n" +
"        for(let ci=0;ci<9;ci++){\r\n" +
"          const addr = XLSXStyle.utils.encode_cell({r:ri+1,c:ci})\r\n" +
"          const cellVal = row[ci] ?? \"\"\r\n" +
"          const cellType = cellVal instanceof Date ? \"d\" : typeof cellVal === \"number\" ? \"n\" : \"s\"\r\n" +
"          if(!ws[addr]) ws[addr] = {t:cellType, v:cellVal}\r\n" +
"          else { ws[addr].t = cellType; ws[addr].v = cellVal }\r\n" +
"          const isDate = (ci===5||ci===7) && row[ci] instanceof Date\r\n" +
"          ws[addr].s = { font:{name:\"Calibri\",sz:11,color:isCancelada?{rgb:\"FF0000\"}:undefined}, fill:{patternType:\"solid\",fgColor:{rgb:bg}}, alignment:{horizontal:aligns[ci]||\"left\",vertical:\"center\"}, border }\r\n" +
"          if(isDate) ws[addr].z = \"dd/mm/yyyy\"\r\n" +
"          if(ci===4||ci===6) ws[addr].z = \"_(R$* #,##0.00_);_(R$* (#,##0.00);_(R$* \\\"-\\\"??_);_(@_)\"\r\n" +
"        }\r\n" +
"      })";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - linhas Venda/Cancelada agora em vermelho");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
