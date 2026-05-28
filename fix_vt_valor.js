const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Corrigir calculo VT: employer paga o valor real do VT, desconta 6% do salario do funcionario
c = c.replace(
  "  const vtValor = usaVT ? (sal + heValor) * 0.06 : 0",
  "  const vtTotal = usaVT ? (parseFloat(func.vale_transporte_valor) || 0) : 0\n  const vtDesconto = usaVT ? Math.min((sal + heValor) * 0.06, vtTotal) : 0\n  const vtValor = vtTotal // custo bruto para empresa"
);

// 2. Ajustar descontos para incluir vtDesconto
c = c.replace(
  "  const desVT = usaVT ? (sal + heValor) * 0.06 : 0",
  "  const desVT = vtDesconto"
);

// 3. Adicionar campo no formulario de funcionario
c = c.replace(
  "{k:'empresa_id',l:'Empresa (1=SIX, 2=ENOVA)',t:'number'}",
  "{k:'empresa_id',l:'Empresa (1=SIX, 2=ENOVA)',t:'number'},{k:'vale_transporte_valor',l:'Valor Total VT (R$/mês)',t:'number'}"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("vale_transporte_valor") && c.includes("vtDesconto");
console.log(ok ? "OK" : "FALHOU");
