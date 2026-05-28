const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "  const vtValor = usaVT ? Math.max(0, vtUnitario * diasVT * (1 + dsrFator) - vtDesconto) : 0",
  "  const vtValor = usaVT ? Math.max(0, vtUnitario * diasVT * 1.06 - vtDesconto) : 0"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("* 1.06 -") ? "OK" : "FALHOU");
