const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Linha 333: filtrar parciais com data valida
c = c.replace(
  "if(lista.length>0) return lista.map((p:any)=>{ const dt=p.dt_pagamento||''; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); return parts[1]?.padStart(2,'0')+'/'+parts[2] })",
  "if(lista.length>0) return lista.map((p:any)=>{ const dt=p.dt_pagamento||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean)"
);

// Linha 334: filtrar nota sem historico com data valida
c = c.replace(
  "const dtP=r.dt_pagamento||r.data_pagamento||''; if(!dtP) return []; const parts=dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); return [parts[1]?.padStart(2,'0')+'/'+parts[2]]",
  "const dtP=r.dt_pagamento||r.data_pagamento||''; if(!dtP) return []; const parts=dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? [mm.padStart(2,'0')+'/'+aa] : []"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("isNaN(+mm)") ? "OK" : "FALHOU");
