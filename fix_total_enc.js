const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Incluir va e dinheiro no totalEncargos
c = c.replace(
  "  const totalEncargos = ferias13 + fgts + multaFgts + heValor + heDsr + vtValor",
  "  const totalEncargos = ferias13 + fgts + multaFgts + heValor + heDsr + vtValor + va + dinheiro"
);

// Ajustar totalEmpresa para nao duplicar va e dinheiro
c = c.replace(
  "  const totalEmpresa = sal + totalEncargos + va + dinheiro",
  "  const totalEmpresa = sal + totalEncargos"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("+ va + dinheiro") && c.includes("sal + totalEncargos\n");
console.log(ok ? "OK" : "FALHOU");
