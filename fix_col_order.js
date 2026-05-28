const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Reordenar cabecalho
c = c.replace(
  "['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','H.Extras','% H.E.','DSR','Total Enc.','% Enc.','Custo Total','H.E. (h)']",
  "['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','H.E. (h)','% H.E.','H.Extras','DSR','Total Enc.','% Enc.','Custo Total']"
);

// 2. Reordenar celulas nas linhas - mover input HE para antes de heValor
// Antes: heValor | select pctHE | heDsr | ... | input horas
// Depois: input horas | select pctHE | heValor | heDsr | ...

const OLD_CELLS = `                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>
                  <td style={{...st.td, padding:'6px 8px'}}>
                    <select value={pctHE[f.id] || 1.5} onChange={e => setPctHE(p => ({...p, [f.id]: +e.target.value}))}
                      style={{...st.input, width:70, padding:'4px 6px', fontSize:11}}>
                      <option value={1.5}>50%</option>
                      <option value={2.0}>100%</option>
                    </select>
                  </td>
                  <td style={st.td}>{f.calc.heDsr > 0 ? fmtR(f.calc.heDsr) : '—'}</td>`;

const NEW_CELLS = `                  <td style={{...st.td,padding:'6px 8px'}}>
                    <input type="number" min="0" step="0.5" value={horas[f.id]||0} onChange={e=>salvarHoras(f.id,+e.target.value)} style={{...st.input,width:55,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                  </td>
                  <td style={{...st.td, padding:'6px 8px'}}>
                    <select value={pctHE[f.id] || 1.5} onChange={e => setPctHE(p => ({...p, [f.id]: +e.target.value}))}
                      style={{...st.input, width:70, padding:'4px 6px', fontSize:11}}>
                      <option value={1.5}>50%</option>
                      <option value={2.0}>100%</option>
                    </select>
                  </td>
                  <td style={st.td}>{f.calc.heValor > 0 ? fmtR(f.calc.heValor) : '—'}</td>
                  <td style={st.td}>{f.calc.heDsr > 0 ? fmtR(f.calc.heDsr) : '—'}</td>`;

c = c.replace(OLD_CELLS, NEW_CELLS);

// 3. Remover o input HE que estava no final
c = c.replace(
  `                  <td style={{...st.td,padding:'6px 8px'}}>
                    <input type="number" min="0" step="0.5" value={horas[f.id]||0} onChange={e=>salvarHoras(f.id,+e.target.value)} style={{...st.input,width:55,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                  </td>\n                </tr>`,
  `                </tr>`
);

// 4. Reordenar totais - mover celula vazia HE para posicao correta
c = c.replace(
  `                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>\n                <td style={st.td}>—</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>`,
  `                <td style={st.td}>—</td>\n                <td style={st.td}>—</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>\n                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>`
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("'H.E. (h)','% H.E.','H.Extras'");
console.log(ok ? "OK" : "FALHOU");
