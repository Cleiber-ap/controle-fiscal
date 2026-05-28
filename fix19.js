const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  'const wsData: any[][] = [cab, ...rows, [], ["","","","",{f:"SUM(E2:E"+(nRows+1)+")"},"","","",""]]',
  'const sumMes = mesAntIdx + 1\n      const wsData: any[][] = [cab, ...rows, [], ["","","","",{f:"SUM(E2:E"+(nRows+1)+")"},"",{f:"SUMPRODUCT((MONTH(H2:H"+(nRows+1)+")="+sumMes+")*(YEAR(H2:H"+(nRows+1)+")="+anoAnt+")*G2:G"+(nRows+1)+")"},"",""]]'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("SUMPRODUCT") ? "OK" : "FALHOU");
