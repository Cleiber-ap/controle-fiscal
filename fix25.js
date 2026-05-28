const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Remover formula do wsData para G (deixar vazio) e setar depois
c = c.replace(
  '["","","","",{f:"SUM(E2:E"+(nRows+1)+")"},"",{f:"SUMPRODUCT((MONTH(H2:H"+(nRows+1)+")="+sumMes+")*(YEAR(H2:H"+(nRows+1)+")="+anoAnt+")*G2:G"+(nRows+1)+")"},"",""]',
  '["","","","",{f:"SUM(E2:E"+(nRows+1)+")"},"","","",""]'
);

// 2. Setar formula G diretamente na celula apos aoa_to_sheet + tornar G celula branca
c = c.replace(
  '      const sumRowIdx = nRows + 2',
  '      const sumRowIdx = nRows + 2\n      const gAddr = XLSXStyle.utils.encode_cell({r:sumRowIdx,c:6})\n      ws[gAddr] = {t:"n",v:0,f:"SUMPRODUCT((MONTH(H2:H"+(nRows+1)+")="+sumMes+")*(YEAR(H2:H"+(nRows+1)+")="+anoAnt+")*G2:G"+(nRows+1)+")"}'
);

// 3. Tornar coluna G tambem branca e com formato R$ na sumRow
c = c.replace(
  '        const isSum = ci===4',
  '        const isSum = ci===4 || ci===6'
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("ci===4 || ci===6") && c.includes("gAddr");
console.log(ok ? "OK" : "FALHOU");
