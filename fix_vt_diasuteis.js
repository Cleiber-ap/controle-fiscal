const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar estado diasVT (Seg-Sex sem feriados)
c = c.replace(
  "  const [diasSegSab, setDiasSegSab] = useState(25)",
  "  const [diasSegSab, setDiasSegSab] = useState(25)\n  const [diasVT, setDiasVT] = useState(20) // Seg-Sex excluindo feriados"
);

// 2. Passar diasVT para calcEncargos
c = c.replace(
  "calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5, diasSegSab)",
  "calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5, diasSegSab, diasVT)"
);

// 3. Adicionar diasVT na assinatura da funcao
c = c.replace(
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6, multHE = 1.5, diasSegSab = 25) {",
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6, multHE = 1.5, diasSegSab = 25, diasVT = 20) {"
);

// 4. Usar diasVT no calculo do VT em vez de diasUteis
c = c.replace(
  "  const vtValor = usaVT ? Math.max(0, vtUnitario * diasUteis * (1 + dsrFator) - vtDesconto) : 0",
  "  const vtValor = usaVT ? Math.max(0, vtUnitario * diasVT * (1 + dsrFator) - vtDesconto) : 0"
);

// 5. Adicionar input Dias VT no header apos Seg-Sab
c = c.replace(
  "          <span style={{ fontSize: 12, color: '#7B82A0' }}>Seg-Sáb:</span>\n          <input type=\"number\" title=\"Dias de segunda a sabado (divisor DSR)\" value={diasSegSab} onChange={e => setDiasSegSab(+e.target.value)} style={{ ...st.input, width: 55 }} />",
  "          <span style={{ fontSize: 12, color: '#7B82A0' }}>Seg-Sáb:</span>\n          <input type=\"number\" title=\"Dias de segunda a sabado (divisor DSR)\" value={diasSegSab} onChange={e => setDiasSegSab(+e.target.value)} style={{ ...st.input, width: 55 }} />\n          <span style={{ fontSize: 12, color: '#7B82A0' }}>Dias VT:</span>\n          <input type=\"number\" title=\"Dias uteis Seg-Sex excluindo feriados (para VT)\" value={diasVT} onChange={e => setDiasVT(+e.target.value)} style={{ ...st.input, width: 55 }} />"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("diasVT") && c.includes("vtUnitario * diasVT");
console.log(ok ? "OK" : "FALHOU");
