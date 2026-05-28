const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

// 1. Adicionar estado faltasAtrasos por funcionario
c = c.replace(
  "  const [pctHE, setPctHE] = useState<Record<number, number>>({}) // 1.5 = 50%, 2.0 = 100%",
  "  const [pctHE, setPctHE] = useState<Record<number, number>>({})\n  const [faltasAtrasos, setFaltasAtrasos] = useState<Record<number, number>>({})"
);

// 2. Adicionar faltas e vale no calcEncargos
c = c.replace(
  "  const desVT = vtDesconto",
  "  const faltas = 0 // passado externamente\n  const vale = sal * 0.40\n  const desVT = vtDesconto"
);
c = c.replace(
  "  const totalDescontos = inss + desVT",
  "  const totalDescontos = inss + desVT + faltas + vale"
);
// Retornar faltas e vale no objeto
c = c.replace(
  "  return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, totalEncargos, totalDescontos, salLiquido, totalEmpresa, pctEncargos: totalEncargos / sal }",
  "  return { sal, ferias13, fgts, multaFgts, heValor, heDsr, vtValor, va, dinheiro, inss, desVT, vale, totalEncargos, totalDescontos, salLiquido, totalEmpresa, pctEncargos: totalEncargos / sal }"
);

// 3. Passar faltasAtrasos no calculo e incluir no totalDescontos real
c = c.replace(
  "calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5, diasSegSab)",
  "{ ...calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5, diasSegSab), faltasAtrasos: faltasAtrasos[f.id] || 0, totalDescontos: calcEncargos(f, diasUteis, horas[f.id] || 0, domingosFeriados, pctHE[f.id] || 1.5, diasSegSab).totalDescontos + (faltasAtrasos[f.id] || 0) }"
);

// 4. Atualizar colspan Descontos de 3 para 5
c = c.replace(
  '<th colSpan={3} style={{...st.th, background:\'#251A2A\', color:\'#F87171\', textAlign:\'center\', borderBottom:\'1px solid #F87171\', borderRadius:\'4px 4px 0 0\'}}>🔻 Descontos</th>',
  '<th colSpan={5} style={{...st.th, background:\'#251A2A\', color:\'#F87171\', textAlign:\'center\', borderBottom:\'1px solid #F87171\', borderRadius:\'4px 4px 0 0\'}}>🔻 Descontos</th>'
);

// 5. Adicionar colunas no cabecalho
c = c.replace(
  "'INSS','Desc. VT','Total Desc.'",
  "'INSS','Desc. VT','Faltas/Atr.','Vale 40%','Total Desc.'"
);

// 6. Adicionar celulas nas linhas de dados
c = c.replace(
  "                  <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.inss)}</td>\n                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>\n                  <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(f.calc.totalDescontos)}</td>",
  `                  <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.inss)}</td>
                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>
                  <td style={{...st.td,padding:'6px 8px'}}>
                    <input type="number" min="0" step="0.01" value={faltasAtrasos[f.id]||0}
                      onChange={e=>setFaltasAtrasos(p=>({...p,[f.id]:+e.target.value}))}
                      style={{...st.input,width:80,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                  </td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.vale)}</td>
                  <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(f.calc.totalDescontos)}</td>`
);

// 7. Adicionar totais para Faltas e Vale no footer
c = c.replace(
  "                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.inss,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>\n                <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.totalDescontos,0))}</td>",
  "                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.inss,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(Object.values(faltasAtrasos).reduce((s,v)=>s+v,0))}</td>\n                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vale,0))}</td>\n                <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.totalDescontos,0))}</td>"
);

fs.writeFileSync(f, c, "utf8");
const ok = c.includes("faltasAtrasos") && c.includes("f.calc.vale") && c.includes("Vale 40%");
console.log(ok ? "OK" : "FALHOU");
