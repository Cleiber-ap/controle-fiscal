const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

const OLD = `      rows.forEach((row:any[], ri:number) => {
        const bg = ri%2===0 ? "FFFFFF" : "ECECEC"
        for(let ci=0;ci<9;ci++){
          const addr = XLSXStyle.utils.encode_cell({r:ri+1,c:ci})
          if(!ws[addr]) ws[addr]={t:"z",v:""}
          const isDate = (ci===5||ci===7) && row[ci] instanceof Date
          ws[addr].s = { font:{name:"Calibri",sz:11}, fill:{patternType:"solid",fgColor:{rgb:bg}}, alignment:{horizontal:aligns[ci]||"left",vertical:"center"}, border }
          if(isDate) ws[addr].z = "dd/mm/yyyy"
        }
      })`;

const NEW = `      rows.forEach((row:any[], ri:number) => {
        const bg = ri%2===0 ? "FFFFFF" : "ECECEC"
        for(let ci=0;ci<9;ci++){
          const addr = XLSXStyle.utils.encode_cell({r:ri+1,c:ci})
          const cellVal = row[ci] ?? ""
          const cellType = cellVal instanceof Date ? "d" : typeof cellVal === "number" ? "n" : "s"
          if(!ws[addr]) ws[addr] = {t:cellType, v:cellVal}
          else { ws[addr].t = cellType; ws[addr].v = cellVal }
          const isDate = (ci===5||ci===7) && row[ci] instanceof Date
          ws[addr].s = { font:{name:"Calibri",sz:11}, fill:{patternType:"solid",fgColor:{rgb:bg}}, alignment:{horizontal:aligns[ci]||"left",vertical:"center"}, border }
          if(isDate) ws[addr].z = "dd/mm/yyyy"
        }
      })`;

c = c.replace(OLD, NEW);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("cellType") ? "OK" : "FALHOU");
