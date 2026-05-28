const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
const lines = fs.readFileSync(f, "utf8").split('\n');

// Encontrar linha do useEffect com calcCalendario
const useEffectIdx = lines.findIndex(l => l.includes("const cal = calcCalendario"));
// Encontrar linha do useState diasUteis
const diasUteisIdx = lines.findIndex(l => l.includes("[diasUteis, setDiasUteis]"));

console.log("useEffect linha:", useEffectIdx+1, "| diasUteis linha:", diasUteisIdx+1);

if (useEffectIdx > -1 && diasUteisIdx > -1 && useEffectIdx < diasUteisIdx) {
  // useEffect esta ANTES dos useState - remover o bloco useEffect (5 linhas)
  const start = lines.findIndex(l => l.trim() === "useEffect(() => {" && lines[lines.indexOf(l)+1]?.includes("carregar()") && lines[lines.indexOf(l)+2]?.includes("cal = calcCalendario"));
  
  // Achar inicio do bloco problemático pelo contexto
  let blockStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("useEffect") && lines[i+1]?.includes("carregar()") && lines[i+2]?.includes("calcCalendario")) {
      blockStart = i; break;
    }
  }
  
  if (blockStart > -1) {
    // Remover bloco de 8 linhas (useEffect + corpo + fechamento)
    let blockEnd = blockStart;
    let depth = 0;
    for (let i = blockStart; i < lines.length; i++) {
      for (const ch of lines[i]) { if(ch==='{') depth++; else if(ch==='}') depth--; }
      if (depth <= 0 && i > blockStart) { blockEnd = i; break; }
    }
    console.log("Removendo bloco linhas:", blockStart+1, "a", blockEnd+1);
    lines.splice(blockStart, blockEnd - blockStart + 1);
    
    // Agora achar diasUteis de novo e inserir useEffect simples apos faltasAtrasos
    const faltasIdx = lines.findIndex(l => l.includes("[faltasAtrasos, setFaltasAtrasos]"));
    const newUseEffect = [
      "  useEffect(() => {",
      "    carregar()",
      "    const cal = calcCalendario(mesRef.mes, mesRef.ano)",
      "    setDiasUteis(cal.diasUteis)",
      "    setDomingosFeriados(cal.domingosFeriados)",
      "    setDiasSegSab(cal.diasSegSab)",
      "    setDiasVT(cal.diasVT)",
      "  }, [mesRef])"
    ];
    lines.splice(faltasIdx + 1, 0, ...newUseEffect);
    console.log("useEffect inserido após linha:", faltasIdx+1);
  }
}

fs.writeFileSync(f, lines.join('\n'), "utf8");
const result = fs.readFileSync(f, "utf8");
const uIdx = result.split('\n').findIndex(l => l.includes("cal = calcCalendario"));
const dIdx = result.split('\n').findIndex(l => l.includes("[diasUteis, setDiasUteis]"));
console.log("Após fix - useEffect linha:", uIdx+1, "| diasUteis linha:", dIdx+1);
console.log(uIdx > dIdx ? "OK - ordem correta" : "FALHOU - ainda invertido");
