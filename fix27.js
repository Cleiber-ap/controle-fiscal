const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Remover formula SUMPRODUCT e calcular em JS
c = c.replace(
  '      const gAddr = XLSXStyle.utils.encode_cell({r:sumRowIdx,c:6})\n      ws[gAddr] = {t:"n",v:0,f:"SUMPRODUCT((H2:H"+(nRows+1)+">=DATE("+anoAnt+","+sumMes+",1))*(H2:H"+(nRows+1)+"<DATE("+anoAnt+","+(sumMes===12?1:sumMes+1)+","+(sumMes===12?anoAnt+1:anoAnt)+"))*G2:G"+(nRows+1)+")"}',
  '      const somaVlPago = rows.reduce((s:number, row:any[]) => {\n        const dtH = row[7]\n        if(!(dtH instanceof Date)) return s\n        if(dtH.getMonth()===mesAntIdx && dtH.getFullYear()===anoAnt) return s + (parseFloat(row[6])||0)\n        return s\n      }, 0)\n      const gAddr = XLSXStyle.utils.encode_cell({r:sumRowIdx,c:6})\n      ws[gAddr] = {t:"n",v:somaVlPago}'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("somaVlPago") ? "OK" : "FALHOU");
