const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  'type="number" min="0" step="0.01" value={faltasAtrasos[f.id]||0}',
  'type="text" value={faltasAtrasos[f.id]||0}'
);
c = c.replace(
  'onChange={e=>setFaltasAtrasos(p=>({...p,[f.id]:+e.target.value}))}',
  'onChange={e=>setFaltasAtrasos(p=>({...p,[f.id]:parseFloat(e.target.value.replace(",","."))||0}))}'
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes('type="text" value={faltasAtrasos') ? "OK" : "FALHOU");
