const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Reverter fix7 - voltar para pgtos.some
c = c.replace(
  "        return pgtos.length>0 && pgtos.every((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes(\"-\")?dt.split(\"-\"):dt.split(\"/\").reverse(); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt })",
  "        return pgtos.some((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes(\"-\")?dt.split(\"-\"):dt.split(\"/\").reverse(); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt })"
);

// 2. Filtrar pagamentos do mes ao gerar linhas
c = c.replace(
  "        if(pgtos.length>0){\n          pgtos.forEach((p:any)=>rows.push([n.numero_nf||\"\"",
  "        const pgtosMes = pgtos.filter((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes(\"-\")?dt.split(\"-\"):dt.split(\"/\").reverse(); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt })\n        if(pgtosMes.length>0){\n          pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||\"\""
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("pgtosMes") && c.includes("pgtos.some") ? "OK" : "FALHOU");
