const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Adicionar calculo do deposito
c = c.replace(
  "  const totalGeral = calculos.reduce((s, f) => s + f.calc.totalEmpresa, 0)",
  "  const totalGeral = calculos.reduce((s, f) => s + f.calc.totalEmpresa, 0)\n  const totalDeposito = calculos.reduce((s, f) => s + f.calc.ferias13 + f.calc.fgts + f.calc.multaFgts, 0)"
);

// Adicionar card Deposito apos Custo Total
c = c.replace(
  "        { label: 'Custo Total Empresa', valor: totalGeral, cor: '#34D399' },",
  "        { label: 'Custo Total Empresa', valor: totalGeral, cor: '#34D399' },\n          { label: 'Depósito (Fér+13°+FGTS+Multa)', valor: totalDeposito, cor: '#A78BFA' },"
);

// Ajustar grid para 4 colunas
c = c.replace(
  "      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>",
  "      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("totalDeposito") && c.includes("repeat(4, 1fr)");
console.log(ok ? "OK" : "FALHOU");
