const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/components/Layout/index.tsx";
let c = fs.readFileSync(f, "utf8");
c = c.replace(
  '<NavItem path="/impostos" icon="\uD83D\uDCB3" label="Impostos Pagos" />',
  '<NavItem path="/impostos" icon="\uD83D\uDCB3" label="Impostos Pagos" />\n          <NavItem path="/encargos" icon="\uD83D\uDC77" label="Encargos" />'
);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes('path="/encargos"') ? "OK" : "FALHOU");
