const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Reverter legenda para valor fixo seguro
c = c.replace(
  "{(ultimos3Anos||[]).map((ano, i) => ({ cor: ['#4F8EF7','#34D399','#FBBF24'][i], l: String(ano) })).map(e => (",
  "{[{ cor: '#4F8EF7', l: 'SIX' }, { cor: '#34D399', l: 'ENOVA' }, { cor: '#FBBF24', l: 'Anterior' }].map(e => ("
);

// 2. Calcular ultimos3Anos no escopo do componente (fora do useEffect)
// Ja existe como const ultimos3Anos dentro do useEffect - precisa expor
// Adicionar um useMemo no escopo do componente
c = c.replace(
  "  const todosAnos = [...new Set(dadosAnuais.map(d => d.ano))].sort((a, b) => a - b)",
  "  const todosAnos = [...new Set(dadosAnuais.map(d => d.ano))].sort((a, b) => a - b)\n  const ultimos3Anos = todosAnos.slice(-3)"
);

// 3. Atualizar legenda para usar ultimos3Anos do escopo
c = c.replace(
  "{[{ cor: '#4F8EF7', l: 'SIX' }, { cor: '#34D399', l: 'ENOVA' }, { cor: '#FBBF24', l: 'Anterior' }].map(e => (",
  "{ultimos3Anos.map((ano, i) => ({ cor: ['#4F8EF7','#34D399','#FBBF24'][i], l: String(ano) })).map(e => ("
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("const ultimos3Anos = todosAnos.slice(-3)") && c.includes("ultimos3Anos.map((ano, i)");
console.log(ok ? "OK" : "FALHOU");
