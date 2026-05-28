const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
const lines = fs.readFileSync(f, "utf8").split('\n');

// Verificar quais estados existem
const hasDomingos = lines.some(l => l.includes("[domingosFeriados, setDomingosFeriados]"));
const hasSegSab = lines.some(l => l.includes("[diasSegSab, setDiasSegSab]"));
const hasDiasVT = lines.some(l => l.includes("[diasVT, setDiasVT]"));

console.log("domingosFeriados:", hasDomingos, "| diasSegSab:", hasSegSab, "| diasVT:", hasDiasVT);

// Inserir estados faltantes apos diasUteis (linha 116, indice 115)
const diasUteisIdx = lines.findIndex(l => l.includes("[diasUteis, setDiasUteis]"));
const toInsert = [];
if (!hasDomingos) toInsert.push("  const [domingosFeriados, setDomingosFeriados] = useState(6)");
if (!hasSegSab) toInsert.push("  const [diasSegSab, setDiasSegSab] = useState(25)");
if (!hasDiasVT) toInsert.push("  const [diasVT, setDiasVT] = useState(20)");

if (toInsert.length > 0) {
  lines.splice(diasUteisIdx + 1, 0, ...toInsert);
  console.log("Inseridos:", toInsert.length, "estados após linha", diasUteisIdx+1);
}

fs.writeFileSync(f, lines.join('\n'), "utf8");
console.log("OK");
