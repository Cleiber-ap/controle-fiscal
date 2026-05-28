const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
const lines = fs.readFileSync(f, "utf8").split('\n');

// Encontrar e remover linhas 162-170 (bloco truncado)
// Achar linha que contem "Ano label no primeiro mes"
const startIdx = lines.findIndex(l => l.includes("Ano label no primeiro mes"));
// Achar linha que contem "isCurr ? '#FBBF24'" no contexto do fillText
const endIdx = lines.findIndex(l => l.includes("String(d.ano)"));

console.log("startIdx:", startIdx+1, "endIdx:", endIdx+1);

if (startIdx > -1 && endIdx > -1) {
  // Remover do startIdx ate endIdx+1 (inclusive)
  lines.splice(startIdx, endIdx - startIdx + 2); // +2 para pegar ate })
  const result = lines.join('\n');
  fs.writeFileSync(f, result, "utf8");
  console.log("OK - linhas removidas");
} else {
  console.log("FALHOU - linhas nao encontradas");
}
