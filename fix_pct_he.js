const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar estado pctHE por funcionario
c = c.replace(
  "  const [horas, setHoras] = useState<Record<number, number>>({})",
  "  const [horas, setHoras] = useState<Record<number, number>>({})\n  const [pctHE, setPctHE] = useState<Record<number, number>>({}) // 1.5 = 50%, 2.0 = 100%"
);

// 2. Passar pctHE para calcEncargos
c = c.replace(
  "calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados)",
  "calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5)"
);

// 3. Corrigir assinatura da funcao
c = c.replace(
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6) {",
  "function calcEncargos(func: any, diasUteis: number, horasExtras: number, domingosFeriados = 6, multHE = 1.5) {"
);

// 4. Usar multHE no calculo
c = c.replace(
  "  const heValor = horasExtras * horaValor * 1.5",
  "  const heValor = horasExtras * horaValor * multHE"
);

// 5. Adicionar coluna no cabecalho após H.Extras
c = c.replace(
  "'H.Extras','DSR'",
  "'H.Extras','% H.E.','DSR'"
);

// 6. Adicionar célula com select na linha de dados após heValor
c = c.replace(
  "                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>\n                  <td style={st.td}>{f.calc.heDsr > 0 ? fmtR(f.calc.heDsr) : '—'}</td>",
  `                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>
                  <td style={{...st.td, padding:'6px 8px'}}>
                    <select value={pctHE[f.id] || 1.5} onChange={e => setPctHE(p => ({...p, [f.id]: +e.target.value}))}
                      style={{...st.input, width:70, padding:'4px 6px', fontSize:11}}>
                      <option value={1.5}>50%</option>
                      <option value={2.0}>100%</option>
                    </select>
                  </td>
                  <td style={st.td}>{f.calc.heDsr > 0 ? fmtR(f.calc.heDsr) : '—'}</td>`
);

// 7. Adicionar célula vazia no total para % HE
c = c.replace(
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>",
  "                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>\n                <td style={st.td}>—</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("pctHE") && c.includes("multHE") && c.includes("'% H.E.'");
console.log(ok ? "OK" : "FALHOU");
