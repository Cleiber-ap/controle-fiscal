const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Trocar formula SUMPRODUCT com MONTH/YEAR por comparacao de data com DATE()
c = c.replace(
  '"SUMPRODUCT((MONTH(H2:H"+(nRows+1)+")="+sumMes+")*(YEAR(H2:H"+(nRows+1)+")="+anoAnt+")*G2:G"+(nRows+1)+")"',
  '"SUMPRODUCT((H2:H"+(nRows+1)+">=DATE("+anoAnt+","+sumMes+",1))*(H2:H"+(nRows+1)+"<DATE("+anoAnt+","+(sumMes===12?1:sumMes+1)+","+(sumMes===12?anoAnt+1:anoAnt)+"))*G2:G"+(nRows+1)+")"'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("DATE("+'"') || c.includes('DATE(") ? "OK" : "FALHOU"') ? "CHECANDO" : "");

// Verificar se SUMPRODUCT ainda existe com DATE
const updated = fs.readFileSync(f, "utf8");
console.log(updated.includes("DATE(") && updated.includes("SUMPRODUCT") ? "OK" : "FALHOU");
