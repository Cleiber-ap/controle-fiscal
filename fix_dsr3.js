const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar estado diasSegSab (divisor DSR)
c = c.replace(
  "  const [domingosFeriados, setDomingosFeriados] = useState(6)",
  "  const [domingosFeriados, setDomingosFeriados] = useState(6)\n  const [diasSegSab, setDiasSegSab] = useState(25) // Mon-Sat para divisor DSR"
);

// 2. Passar diasSegSab para calcEncargos
c = c.replace(
  "calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5)",
  "calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5, diasSegSab)"
);

// 3. Corrigir assinatura e usar diasSegSab no DSR
c = c.replace(
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6, multHE = 1.5) {",
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6, multHE = 1.5, diasSegSab = 25) {"
);
c = c.replace(
  "  const heDsr = horasExtras > 0 ? (heValor / diasUteis) * domingosFeriados : 0",
  "  const heDsr = horasExtras > 0 ? (heValor / diasSegSab) * domingosFeriados : 0"
);

// 4. Adicionar input Dias Seg-Sab no header
c = c.replace(
  "          <span style={{ fontSize: 12, color: '#7B82A0' }}>Dom+Feriados:</span>\n          <input type=\"number\" value={domingosFeriados} onChange={e => setDomingosFeriados(+e.target.value)} style={{ ...st.input, width: 55 }} />",
  "          <span style={{ fontSize: 12, color: '#7B82A0' }}>Seg-Sáb:</span>\n          <input type=\"number\" title=\"Dias de segunda a sabado (divisor DSR)\" value={diasSegSab} onChange={e => setDiasSegSab(+e.target.value)} style={{ ...st.input, width: 55 }} />\n          <span style={{ fontSize: 12, color: '#7B82A0' }}>Dom+Fer:</span>\n          <input type=\"number\" title=\"Domingos + feriados sem duplicar domingo-feriado\" value={domingosFeriados} onChange={e => setDomingosFeriados(+e.target.value)} style={{ ...st.input, width: 55 }} />"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("diasSegSab") && c.includes("(heValor / diasSegSab) * domingosFeriados");
console.log(ok ? "OK" : "FALHOU");
