const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx";
let c = fs.readFileSync(f, "utf8");

const OLD = `      {aba === 'resumo' && (
        <div style={st.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th colSpan={3} style={{...st.th, borderBottom:'none'}} />
                <th colSpan={9} style={{...st.th, background:'#1A2535', color:'#4F8EF7', textAlign:'center', borderBottom:'1px solid #4F8EF7', borderRadius:'4px 4px 0 0'}}>📊 Encargos</th>
                <th colSpan={2} style={{...st.th, background:'#1A2535', color:'#FBBF24', textAlign:'center', borderBottom:'1px solid #FBBF24', borderRadius:'4px 4px 0 0'}}>💰 Totais</th>
                <th colSpan={5} style={{...st.th, background:'#251A2A', color:'#F87171', textAlign:'center', borderBottom:'1px solid #F87171', borderRadius:'4px 4px 0 0'}}>🔻 Descontos</th>
                <th colSpan={1} style={{...st.th, borderBottom:'none'}} />
              </tr>
              <tr>{['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','V.Alim.','Sal.Din.','H.E.(h)','%HE','H.Extras','DSR','Total Enc.','% Enc.','INSS','Desc. VT','Faltas/Atr.','Vale 40%','Total Desc.','Custo Total'].map(h => <th key={h} style={st.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {calculos.map(f => (
                <tr key={f.id} onMouseEnter={e=>(e.currentTarget.style.background='#1A1D2A')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                  <td style={st.td}><b>{f.nome.split(' ').slice(0,2).join(' ')}</b></td>
                  <td style={{...st.td,color:'#7B82A0',fontSize:11}}>{f.cargo}</td>
                  <td style={st.td}>{fmtR(f.calc.sal)}</td>
                  <td style={st.td}>{fmtR(f.calc.ferias13)}</td>
                  <td style={st.td}>{fmtR(f.calc.fgts)}</td>
                  <td style={st.td}>{fmtR(f.calc.multaFgts)}</td>
                  <td style={st.td}>{fmtR(f.calc.vtValor)}</td>
                  <td style={st.td}>{fmtR(f.calc.va)}</td>
                  <td style={st.td}>{f.calc.dinheiro > 0 ? fmtR(f.calc.dinheiro) : '—'}</td>
                  <td style={{...st.td,padding:'6px 8px'}}>
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
                  <td style={st.td}>{f.calc.heDsr > 0 ? fmtR(f.calc.heDsr) : '—'}</td>
                  <td style={{...st.td,color:'#FBBF24',fontWeight:700}}>{fmtR(f.calc.totalEncargos)}</td>
                  <td style={{...st.td,color:'#7B82A0'}}>{(f.calc.pctEncargos*100).toFixed(1)}%</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.inss)}</td>
                  <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>
                  <td style={{...st.td,padding:'6px 8px'}}>
                    <input type="text" value={faltasAtrasos[f.id]||0}
                      onChange={e=>setFaltasAtrasos(p=>({...p,[f.id]:parseFloat(e.target.value.replace(",","."))||0}))}
                      style={{...st.input,width:80,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                  </td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.vale)}</td>
                  <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(f.calc.totalDescontos)}</td>
                  <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(f.calc.totalEmpresa)}</td>
                </tr>
              ))}
              <tr style={{background:'#1A1D2A'}}>
                <td style={{...st.td,fontWeight:700}} colSpan={2}>TOTAL</td>
                <td style={st.td}>{fmtR(totalSalarios)}</td>
                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.ferias13,0))}</td>
                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.fgts,0))}</td>
                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.multaFgts,0))}</td>
                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vtValor,0))}</td>
                <td style={st.td}>—</td>
                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>
                <td style={st.td}>—</td>
                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>
                <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>
                <td style={{...st.td,color:'#FBBF24',fontWeight:700}}>{fmtR(totalEncargosGeral)}</td>
                <td style={{...st.td,color:'#7B82A0'}}>{totalSalarios>0?(totalEncargosGeral/totalSalarios*100).toFixed(1)+'%':'—'}</td>
                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.inss,0))}</td>
                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>
                <td style={{...st.td,color:'#F87171'}}>{fmtR(Object.values(faltasAtrasos).reduce((s,v)=>s+v,0))}</td>
                <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vale,0))}</td>
                <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.totalDescontos,0))}</td>
                <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(totalGeral)}</td>
                <td style={st.td}/>
              </tr>
            </tbody>
          </table>
        </div>
      )}`;

const NEW = `      {aba === 'resumo' && (
        <div>
          {/* QUADRO 1 - ENCARGOS */}
          <div style={{...st.card, borderColor:'#4F8EF744'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#4F8EF7',marginBottom:12}}>📊 Encargos</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>{['Funcionário','Cargo','Salário','Férias+13°','FGTS','Multa 40%','V.Transp.','V.Alim.','Sal.Din.','H.E.(h)','%HE','H.Extras','DSR','Total Enc.','% Enc.','Custo Total'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {calculos.map(f=>(
                  <tr key={f.id} onMouseEnter={e=>(e.currentTarget.style.background='#1A1D2A')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <td style={st.td}><b>{f.nome.split(' ').slice(0,2).join(' ')}</b></td>
                    <td style={{...st.td,color:'#7B82A0',fontSize:11}}>{f.cargo}</td>
                    <td style={st.td}>{fmtR(f.calc.sal)}</td>
                    <td style={st.td}>{fmtR(f.calc.ferias13)}</td>
                    <td style={st.td}>{fmtR(f.calc.fgts)}</td>
                    <td style={st.td}>{fmtR(f.calc.multaFgts)}</td>
                    <td style={st.td}>{fmtR(f.calc.vtValor)}</td>
                    <td style={st.td}>{fmtR(f.calc.va)}</td>
                    <td style={st.td}>{f.calc.dinheiro>0?fmtR(f.calc.dinheiro):'—'}</td>
                    <td style={{...st.td,padding:'6px 8px'}}>
                      <input type="number" min="0" step="0.5" value={horas[f.id]||0} onChange={e=>salvarHoras(f.id,+e.target.value)} style={{...st.input,width:55,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                    </td>
                    <td style={{...st.td,padding:'6px 8px'}}>
                      <select value={pctHE[f.id]||1.5} onChange={e=>setPctHE(p=>({...p,[f.id]:+e.target.value}))} style={{...st.input,width:70,padding:'4px 6px',fontSize:11}}>
                        <option value={1.5}>50%</option>
                        <option value={2.0}>100%</option>
                      </select>
                    </td>
                    <td style={st.td}>{f.calc.heValor>0?fmtR(f.calc.heValor):'—'}</td>
                    <td style={st.td}>{f.calc.heDsr>0?fmtR(f.calc.heDsr):'—'}</td>
                    <td style={{...st.td,color:'#FBBF24',fontWeight:700}}>{fmtR(f.calc.totalEncargos)}</td>
                    <td style={{...st.td,color:'#7B82A0'}}>{(f.calc.pctEncargos*100).toFixed(1)}%</td>
                    <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(f.calc.totalEmpresa)}</td>
                  </tr>
                ))}
                <tr style={{background:'#1A1D2A'}}>
                  <td style={{...st.td,fontWeight:700}} colSpan={2}>TOTAL</td>
                  <td style={st.td}>{fmtR(totalSalarios)}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.ferias13,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.fgts,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.multaFgts,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vtValor,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.va,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.dinheiro,0))}</td>
                  <td style={st.td}>—</td>
                  <td style={st.td}>—</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heValor,0))}</td>
                  <td style={st.td}>{fmtR(calculos.reduce((s,f)=>s+f.calc.heDsr,0))}</td>
                  <td style={{...st.td,color:'#FBBF24',fontWeight:700}}>{fmtR(totalEncargosGeral)}</td>
                  <td style={{...st.td,color:'#7B82A0'}}>{totalSalarios>0?(totalEncargosGeral/totalSalarios*100).toFixed(1)+'%':'—'}</td>
                  <td style={{...st.td,color:'#34D399',fontWeight:700}}>{fmtR(totalGeral)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* QUADRO 2 - DESCONTOS */}
          <div style={{...st.card, borderColor:'#F8717144'}}>
            <div style={{fontSize:13,fontWeight:700,color:'#F87171',marginBottom:12}}>🔻 Descontos</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr>{['Funcionário','Cargo','INSS','Desc. VT','Faltas/Atr.','Vale 40%','Total Desc.'].map(h=><th key={h} style={st.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {calculos.map(f=>(
                  <tr key={f.id} onMouseEnter={e=>(e.currentTarget.style.background='#1A1D2A')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                    <td style={st.td}><b>{f.nome.split(' ').slice(0,2).join(' ')}</b></td>
                    <td style={{...st.td,color:'#7B82A0',fontSize:11}}>{f.cargo}</td>
                    <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.inss)}</td>
                    <td style={{...st.td,color:'#F87171'}}>{f.calc.desVT>0?fmtR(f.calc.desVT):'—'}</td>
                    <td style={{...st.td,padding:'6px 8px'}}>
                      <input type="text" value={faltasAtrasos[f.id]||0}
                        onChange={e=>setFaltasAtrasos(p=>({...p,[f.id]:parseFloat(e.target.value.replace(",","."))||0}))}
                        style={{...st.input,width:80,padding:'4px 6px',fontSize:12,textAlign:'center' as any}} />
                    </td>
                    <td style={{...st.td,color:'#F87171'}}>{fmtR(f.calc.vale)}</td>
                    <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(f.calc.totalDescontos)}</td>
                  </tr>
                ))}
                <tr style={{background:'#1A1D2A'}}>
                  <td style={{...st.td,fontWeight:700}} colSpan={2}>TOTAL</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.inss,0))}</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.desVT,0))}</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(Object.values(faltasAtrasos).reduce((s,v)=>s+v,0))}</td>
                  <td style={{...st.td,color:'#F87171'}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.vale,0))}</td>
                  <td style={{...st.td,color:'#F87171',fontWeight:700}}>{fmtR(calculos.reduce((s,f)=>s+f.calc.totalDescontos,0))}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}`;

c = c.replace(OLD, NEW);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("QUADRO 1") && c.includes("QUADRO 2") ? "OK" : "FALHOU");
