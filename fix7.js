const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
const OLD = "        return pgtos.some((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes(\"-\")?dt.split(\"-\"):dt.split(\"/\").reverse(); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt })";
const NEW = "        return pgtos.length>0 && pgtos.every((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes(\"-\")?dt.split(\"-\"):dt.split(\"/\").reverse(); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt })";
c = c.replace(OLD, NEW);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("pgtos.every") ? "OK" : "FALHOU");
