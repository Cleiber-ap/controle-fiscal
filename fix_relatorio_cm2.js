const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Corrigir desestruturação - incluir h3 (CM)
c = c.replace(
  "]).then(([h1, h2, d1, d2, emp]) => {\n      setHistSix(h1); setHistEnova(h2)",
  "]).then(([h1, h2, h3, d1, d2, emp]) => {\n      setHistSix(h1); setHistEnova(h2); setHistCm(h3||[])"
);

// 2. Adicionar useState para histCm
c = c.replace(
  "const [histSix, setHistSix] = useState<any[]>([])",
  "const [histSix, setHistSix] = useState<any[]>([])\n  const [histCm, setHistCm] = useState<any[]>([])"
);

// 3. Incluir CM nos anos considerados
c = c.replace(
  "const todosAnos = [...new Set([...histSix, ...histEnova].map(r => r.ano))].sort((a, b) => a - b)",
  "const todosAnos = [...new Set([...histSix, ...histEnova, ...histCm].map(r => r.ano))].sort((a, b) => a - b)"
);

// 4. Incluir CM no total getter
c = c.replace(
  "get total() { return this.six + this.enova },",
  "get total() { return this.six + this.enova + this.cm },"
);

// 5. Incluir CM nos meses
c = c.replace(
  "const todosMeses = [...new Set([...histSix, ...histEnova].map(r => `${r.ano}-${r.mes}`))]",
  "const todosMeses = [...new Set([...histSix, ...histEnova, ...histCm].map(r => `${r.ano}-${r.mes}`))]"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("setHistCm") && c.includes("this.six + this.enova + this.cm");
console.log(ok ? "OK" : "FALHOU");
