const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Corrigir calculo VT com formula da planilha
c = c.replace(
  "  const vtTotal = usaVT ? (parseFloat(func.vale_transporte_valor) || 0) : 0\n  const vtDesconto = usaVT ? Math.min((sal + heValor) * 0.06, vtTotal) : 0\n  const vtValor = vtTotal",
  "  const vtUnitario = usaVT ? (parseFloat(func.vale_transporte_valor) || 0) : 0\n  const dsrFator = diasSegSab > 0 ? domingosFeriados / diasSegSab : 0\n  const vtDesconto = usaVT ? (sal + heValor) * 0.06 : 0\n  const vtValor = usaVT ? Math.max(0, vtUnitario * diasUteis * (1 + dsrFator) - vtDesconto) : 0"
);

// 2. Atualizar label do campo no formulario
c = c.replace(
  "'Valor Total VT (R$/mês)'",
  "'Valor Unitário VT (R$/dia)'"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("vtUnitario") && c.includes("dsrFator") && c.includes("Math.max(0,");
console.log(ok ? "OK" : "FALHOU");
