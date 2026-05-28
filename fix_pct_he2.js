const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Corrigir assinatura da funcao e calculo do DSR
c = c.replace(
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number) {",
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6, multHE = 1.5) {"
);
c = c.replace(
  "  const heDsr = horasExtras > 0 ? heValor * (1 / diasUteis) : 0",
  "  const heDsr = horasExtras > 0 ? (heValor / diasUteis) * domingosFeriados : 0"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("multHE = 1.5") && c.includes("domingosFeriados");
console.log(ok ? "OK" : "FALHOU");
