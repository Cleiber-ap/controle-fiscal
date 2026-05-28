const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

c = c.replace(
  "[{ label: 'Total Salários', valor: totalSalarios, cor: '#4F8EF7' }, { label: 'Total Encargos', valor: totalEncargosGeral, cor: '#FBBF24' }, { label: 'Custo Total Empresa', valor: totalGeral, cor: '#34D399' }]",
  "[{ label: 'Total Salários', valor: totalSalarios, cor: '#4F8EF7' }, { label: 'Total Encargos', valor: totalEncargosGeral, cor: '#FBBF24' }, { label: 'Custo Total Empresa', valor: totalGeral, cor: '#34D399' }, { label: 'Depósito (Fér+13°+FGTS+Multa)', valor: totalDeposito, cor: '#A78BFA' }]"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("totalDeposito, cor") ? "OK" : "FALHOU");
