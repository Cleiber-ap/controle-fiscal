const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  "})).filter(Boolean).sort()].map((m:any)=>(<option key={m} value={m}>{m}</option>))}",
  "}))]].flat().filter(Boolean).sort()].map((m:any)=>(<option key={m} value={m}>{m}</option>))}"
);
// Na verdade o fix correto: fechar o Set antes do filter
c = c.replace(
  "}))]].flat().filter(Boolean).sort()].map((m:any)=>(<option key={m} value={m}>{m}</option>))}",
  "}))].filter(Boolean).sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}"
);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("}))].filter(Boolean)") ? "OK" : "FALHOU");
