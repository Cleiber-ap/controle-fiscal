const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  'if(ci===4||ci===6) ws[addr].z = "_(* #,##0.00_);_(* (#,##0.00);_(* \\"-\\"??_);_(@_)"',
  'if(ci===4||ci===6) ws[addr].z = "_(R$* #,##0.00_);_(R$* (#,##0.00);_(R$* \\"-\\"??_);_(@_)"'
);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("R$* #,##0") ? "OK" : "FALHOU");
