const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.split("const [salvando, setSalvando] = useState(false)").join(
  "const [feriadosCustom, setFeriadosCustom] = useState<any[]>([])\n" +
  "  const [formFeriado, setFormFeriado] = useState({dia:'1',mes:'1',descricao:'',tipo:'nacional'})\n" +
  "  const [salvando, setSalvando] = useState(false)"
);

c = c.split("useState<'resumo' | 'funcionarios'>('resumo')").join(
  "useState<'resumo' | 'funcionarios' | 'feriados'>('resumo')"
);

c = c.split("const [fs2, hs] = await Promise.all([").join(
  "const [fs2, hs, frs] = await Promise.all(["
);

c = c.split(".catch(() => ({}))\n    ])").join(
  ".catch(() => ({}))\n" +
  "      fetch(API + '/funcionarios/feriados/', { headers: hdr() }).then(r => r.json()).catch(() => []),\n" +
  "    ])"
);

c = c.split("    setHoras(hs || {})\n  }").join(
  "    setHoras(hs || {})\n" +
  "    const feriadosLista = Array.isArray(frs) ? frs : []\n" +
  "    setFeriadosCustom(feriadosLista)\n" +
  "    const cal = calcCalendario(mesRef.mes, mesRef.ano, feriadosLista)\n" +
  "    setDiasUteis(cal.diasUteis)\n" +
  "    setDomingosFeriados(cal.domingosFeriados)\n" +
  "    setDiasSegSab(cal.diasSegSab)\n" +
  "    setDiasVT(cal.diasVT)\n" +
  "  }"
);

c = c.split(
  "  useEffect(() => {\n    carregar()\n    const cal = calcCalendario(mesRef.mes, mesRef.ano)\n    setDiasUteis(cal.diasUteis)\n    setDomingosFeriados(cal.domingosFeriados)\n    setDiasSegSab(cal.diasSegSab)\n    setDiasVT(cal.diasVT)\n  }, [mesRef])"
).join(
  "  useEffect(() => { carregar() }, [mesRef])"
);

c = c.split("function calcCalendario(mes: number, ano: number) {").join(
  "function calcCalendario(mes: number, ano: number, feriadosExtra: Array<{dia: number, mes: number}> = []) {"
);

c = c.split(
  "    return moveis.some(f => f.getDate()===dm && f.getMonth()+1===mm && f.getFullYear()===d.getFullYear())"
).join(
  "    if (feriadosExtra.some(f => f.dia === dm && f.mes === mm)) return true\n" +
  "    return moveis.some(f => f.getDate()===dm && f.getMonth()+1===mm && f.getFullYear()===d.getFullYear())"
);

c = c.split("['funcionarios', '\u{1F464} Funcion\u00E1rios']].map(([k, l]) => (").join(
  "['funcionarios', '\u{1F464} Funcion\u00E1rios'], ['feriados', '\u{1F5D3}\uFE0F Feriados']].map(([k, l]) => ("
);

const feriadoFuncs =
  "  const salvarFeriado = async () => {\n" +
  "    if (!formFeriado.descricao.trim()) return\n" +
  "    const payload = { dia: parseInt(formFeriado.dia), mes: parseInt(formFeriado.mes), descricao: formFeriado.descricao, tipo: formFeriado.tipo }\n" +
  "    await fetch(API + '/funcionarios/feriados/', { method: 'POST', headers: hdr(), body: JSON.stringify(payload) })\n" +
  "    setFormFeriado({ dia: '1', mes: '1', descricao: '', tipo: 'nacional' })\n" +
  "    showNotif('Feriado salvo!')\n" +
  "    carregar()\n" +
  "  }\n" +
  "  const excluirFeriado = async (fid: number) => {\n" +
  "    await fetch(API + '/funcionarios/feriados/' + fid, { method: 'DELETE', headers: hdr() })\n" +
  "    showNotif('Feriado removido')\n" +
  "    carregar()\n" +
  "  }\n";

c = c.split("  const calculos = funcionarios.map").join(
  feriadoFuncs + "  const calculos = funcionarios.map"
);

const MESES_ARR = "['Janeiro','Fevereiro','Mar\u00E7o','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']";

const feriadosTab =
  "\n      {aba === 'feriados' && (\n" +
  "        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>\n" +
  "          <div style={{background:'#13151F',border:'1px solid #4F8EF744',borderRadius:10,padding:20}}>\n" +
  "            <div style={{fontSize:13,fontWeight:700,color:'#4F8EF7',marginBottom:16}}>\u2795 Adicionar Feriado</div>\n" +
  "            <div style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:10,marginBottom:10}}>\n" +
  "              <div><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Dia</div>\n" +
  "                <input type='number' min='1' max='31' value={formFeriado.dia} onChange={e=>setFormFeriado(p=>({...p,dia:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}/></div>\n" +
  "              <div><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>M\u00EAs</div>\n" +
  "                <select value={formFeriado.mes} onChange={e=>setFormFeriado(p=>({...p,mes:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}>\n" +
  "                  {" + MESES_ARR + ".map((m,i)=><option key={i} value={i+1}>{m}</option>)}\n" +
  "                </select></div>\n" +
  "            </div>\n" +
  "            <div style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Descri\u00E7\u00E3o</div>\n" +
  "              <input type='text' placeholder='Ex: Anivers\u00E1rio de S\u00E3o Paulo' value={formFeriado.descricao} onChange={e=>setFormFeriado(p=>({...p,descricao:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}/>\n" +
  "            </div>\n" +
  "            <div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:600,color:'#7B82A0',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Tipo</div>\n" +
  "              <select value={formFeriado.tipo} onChange={e=>setFormFeriado(p=>({...p,tipo:e.target.value}))} style={{background:'#0E1017',border:'1px solid #2A2D3E',borderRadius:6,color:'#E8EAF0',padding:'7px 10px',fontSize:13,width:'100%',outline:'none'}}>\n" +
  "                <option value='nacional'>\uD83C\uDDE7\uD83C\uDDF7 Nacional</option>\n" +
  "                <option value='estadual'>\uD83C\uDFDB\uFE0F Estadual (SP)</option>\n" +
  "                <option value='municipal'>\uD83C\uDFD9\uFE0F Municipal (S\u00E3o Paulo)</option>\n" +
  "              </select>\n" +
  "            </div>\n" +
  "            <button onClick={salvarFeriado} style={{background:'#4F8EF7',color:'#fff',border:'1px solid #4F8EF7',borderRadius:6,padding:'8px 20px',fontSize:13,fontWeight:600,cursor:'pointer',width:'100%'}}>\uD83D\uDCBE Salvar Feriado</button>\n" +
  "            <div style={{marginTop:16,padding:'10px 12px',background:'#0E1017',borderRadius:6,border:'1px solid #2A2D3E'}}>\n" +
  "              <div style={{fontSize:11,color:'#7B82A0',lineHeight:1.6}}>\u2139\uFE0F Somados aos feriados fixos j\u00E1 inclu\u00EDdos automaticamente (Carnaval, P\u00E1scoa, Corpus Christi, etc).</div>\n" +
  "            </div>\n" +
  "          </div>\n" +
  "          <div style={{background:'#13151F',border:'1px solid #252836',borderRadius:10,padding:20}}>\n" +
  "            <div style={{fontSize:13,fontWeight:700,color:'#E8EAF0',marginBottom:16}}>\uD83D\uDCCB Feriados Cadastrados <span style={{fontSize:11,color:'#7B82A0',fontWeight:400}}>({feriadosCustom.length} registros)</span></div>\n" +
  "            {feriadosCustom.length === 0 ? (\n" +
  "              <div style={{textAlign:'center',color:'#7B82A0',fontSize:13,padding:'32px 0'}}>Nenhum feriado cadastrado.</div>\n" +
  "            ) : (\n" +
  "              <div style={{display:'flex',flexDirection:'column',gap:6}}>\n" +
  "                {feriadosCustom.map((f:any)=>(\n" +
  "                  <div key={f.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'#0E1017',borderRadius:6,padding:'8px 12px',border:'1px solid #2A2D3E'}}>\n" +
  "                    <div style={{display:'flex',alignItems:'center',gap:10}}>\n" +
  "                      <span style={{fontSize:16}}>{f.tipo==='nacional'?'\uD83C\uDDE7\uD83C\uDDF7':f.tipo==='estadual'?'\uD83C\uDFDB\uFE0F':'\uD83C\uDFD9\uFE0F'}</span>\n" +
  "                      <div>\n" +
  "                        <div style={{fontSize:13,fontWeight:600,color:'#E8EAF0'}}>{f.descricao}</div>\n" +
  "                        <div style={{fontSize:11,color:'#7B82A0'}}>{String(f.dia).padStart(2,'0')}/{String(f.mes).padStart(2,'0')} \u00B7 <span style={{color:f.tipo==='nacional'?'#4F8EF7':f.tipo==='estadual'?'#FBBF24':'#34D399'}}>{f.tipo}</span></div>\n" +
  "                      </div>\n" +
  "                    </div>\n" +
  "                    <button onClick={()=>excluirFeriado(f.id)} style={{background:'transparent',border:'1px solid #F8717144',borderRadius:4,color:'#F87171',padding:'4px 8px',fontSize:11,cursor:'pointer'}}>\u2715</button>\n" +
  "                  </div>\n" +
  "                ))}\n" +
  "              </div>\n" +
  "            )}\n" +
  "          </div>\n" +
  "        </div>\n" +
  "      )}";

c = c.split("      )}\n    </div>\n  )\n}").join(
  feriadosTab + "\n      )}\n    </div>\n  )\n}"
);

fs.writeFileSync(p, c, 'utf8');
console.log('Frontend OK');
