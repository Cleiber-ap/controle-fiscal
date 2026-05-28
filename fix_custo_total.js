const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "  const totalEmpresa = sal + totalEncargos + va",
  "  const totalEmpresa = sal + totalEncargos + va + dinheiro"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("sal + totalEncargos + va + dinheiro") ? "OK" : "FALHOU");
