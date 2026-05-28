const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// Adicionar ultimos3Anos no escopo do componente logo apos todosAnos
c = c.replace(
  "  const dadosAnuais = todosAnos.map(ano => ({",
  "  const ultimos3Anos = todosAnos.slice(-3)\n  const dadosAnuais = todosAnos.map(ano => ({"
);

fs.writeFileSync(f, c, "utf8");
console.log(c.includes("const ultimos3Anos = todosAnos.slice(-3)") ? "OK" : "FALHOU");
