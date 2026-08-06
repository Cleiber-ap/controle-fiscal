const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. State
const a1 = "const [filtroMesContb, setFiltroMesContb] = useState('')";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 state"); ok = false; }
else {
  c = c.slice(0, i1) + "const [filtroMesContb, setFiltroMesContb] = useState<string[]>([])\r\n  const [showContbMenu, setShowContbMenu] = useState(false)" + c.slice(i1 + a1.length);
  console.log("OK 1: state convertido para array");
}

// 2. notasFiltradas5
const a2 = "const notasFiltradas5 = filtroMesContb ? notasFiltradas4.filter((r: any) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    if (filtroMesContb === '__VAZIO__') {\r\n" +
"      if (lista.length > 0) {\r\n" +
"        return lista.some((p: any) => !p.data_contabilizacao)\r\n" +
"      }\r\n" +
"      return !r.data_contabilizacao\r\n" +
"    }\r\n" +
"    if (lista.length > 0) {\r\n" +
"      return lista.some((p: any) => {\r\n" +
"        const dt = p.data_contabilizacao || ''\r\n" +
"        const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return (mm + '/' + aa) === filtroMesContb\r\n" +
"      })\r\n" +
"    }\r\n" +
"    const dtC = r.data_contabilizacao || ''\r\n" +
"    if (!dtC) return false\r\n" +
"    const parts = dtC.includes('-') ? dtC.split('-').reverse() : dtC.split('/')\r\n" +
"    const mm = parts[1]?.padStart(2,'0')\r\n" +
"    const aa = parts[2]\r\n" +
"    return (mm + '/' + aa) === filtroMesContb\r\n" +
"  }) : notasFiltradas4";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 notasFiltradas5"); ok = false; }
else {
  const n2 = "const notasFiltradas5 = filtroMesContb.length > 0 ? notasFiltradas4.filter((r: any) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    if (lista.length > 0) {\r\n" +
"      return lista.some((p: any) => {\r\n" +
"        if (!p.data_contabilizacao) return filtroMesContb.includes('__VAZIO__')\r\n" +
"        const parts = p.data_contabilizacao.includes('-') ? p.data_contabilizacao.split('-').reverse() : p.data_contabilizacao.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return filtroMesContb.includes(mm + '/' + aa)\r\n" +
"      })\r\n" +
"    }\r\n" +
"    const dtC = r.data_contabilizacao || ''\r\n" +
"    if (!dtC) return filtroMesContb.includes('__VAZIO__')\r\n" +
"    const parts = dtC.includes('-') ? dtC.split('-').reverse() : dtC.split('/')\r\n" +
"    const mm = parts[1]?.padStart(2,'0')\r\n" +
"    const aa = parts[2]\r\n" +
"    return filtroMesContb.includes(mm + '/' + aa)\r\n" +
"  }) : notasFiltradas4";
  c = c.slice(0, i2) + n2 + c.slice(i2 + a2.length);
  console.log("OK 2: notasFiltradas5 atualizado");
}

// 3. Trocar select por botao + checkboxes
const a3 = "<select value={filtroMesContb} onChange={e=>setFiltroMesContb(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>\r\n" +
"                <option value=\"\">Contabilização: todos</option>\r\n" +
"                <option value=\"__VAZIO__\">Sem contabilização</option>\r\n" +
"                {[...new Set(notas.flatMap((r:any)=>{\r\n" +
"                  const lista=pagamentos[r.numero_nf]||[]\r\n" +
"                  if(lista.length>0) return lista.map((p:any)=>{ const dt=p.data_contabilizacao||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean)\r\n" +
"                  const dtC=r.data_contabilizacao||''; if(!dtC) return []; const parts=dtC.includes('-')?dtC.split('-').reverse():dtC.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? [mm.padStart(2,'0')+'/'+aa] : []\r\n" +
"                }))].filter(Boolean).sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}\r\n" +
"              </select>";
const i3 = c.indexOf(a3);
if (i3 === -1) { console.log("FALHOU: 3 select UI"); ok = false; }
else {
  const n3 = "<div style={{ position: 'relative' }}>\r\n" +
"                <button onClick={() => setShowContbMenu(p => !p)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>\r\n" +
"                  {filtroMesContb.length === 0 ? 'Contabilização: todos' : `Contabilização: ${filtroMesContb.length} selecionado${filtroMesContb.length>1?'s':''}`}\r\n" +
"                </button>\r\n" +
"                {showContbMenu && (<div style={{ position:'absolute', top:'100%', left:0, zIndex:100, background:'#1A1D2A', border:'1px solid #353849', borderRadius:6, padding:'4px 0', minWidth:'170px', maxHeight:'260px', overflowY:'auto' }}>\r\n" +
"                  <label style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', cursor:'pointer', color:'#E8EAF0', fontSize:'12px' }}>\r\n" +
"                    <input type='checkbox' checked={filtroMesContb.includes('__VAZIO__')} onChange={e => setFiltroMesContb(prev => e.target.checked ? [...prev, '__VAZIO__'] : prev.filter(x => x !== '__VAZIO__'))} />\r\n" +
"                    Sem contabilização\r\n" +
"                  </label>\r\n" +
"                  {[...new Set(notas.flatMap((r:any)=>{\r\n" +
"                    const lista=pagamentos[r.numero_nf]||[]\r\n" +
"                    if(lista.length>0) return lista.map((p:any)=>{ const dt=p.data_contabilizacao||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean)\r\n" +
"                    const dtC=r.data_contabilizacao||''; if(!dtC) return []; const parts=dtC.includes('-')?dtC.split('-').reverse():dtC.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? [mm.padStart(2,'0')+'/'+aa] : []\r\n" +
"                  }))].filter(Boolean).sort().map((m:any)=>(\r\n" +
"                    <label key={m} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', cursor:'pointer', color:'#E8EAF0', fontSize:'12px' }}>\r\n" +
"                      <input type='checkbox' checked={filtroMesContb.includes(m)} onChange={e => setFiltroMesContb(prev => e.target.checked ? [...prev, m] : prev.filter(x => x !== m))} />\r\n" +
"                      {m}\r\n" +
"                    </label>\r\n" +
"                  ))}\r\n" +
"                  <div style={{ borderTop:'1px solid #353849', margin:'4px 0', padding:'4px 12px' }}>\r\n" +
"                    <button onClick={() => { setFiltroMesContb([]); setShowContbMenu(false) }} style={{ fontSize:'11px', color:'#7B82A0', background:'none', border:'none', cursor:'pointer' }}>Limpar</button>\r\n" +
"                    <button onClick={() => setShowContbMenu(false)} style={{ fontSize:'11px', color:'#34D399', background:'none', border:'none', cursor:'pointer', marginLeft:8 }}>Aplicar</button>\r\n" +
"                  </div>\r\n" +
"                </div>)}\r\n" +
"              </div>";
  c = c.slice(0, i3) + n3 + c.slice(i3 + a3.length);
  console.log("OK 3: select trocado por botao + checkboxes");
}

// 4. Footer (2 ocorrencias)
const a4 = "(filtroMesEmissao || filtroMesPagto.length > 0 || filtroTipo || filtroMesContb)";
let count4 = 0, idxSearch = 0;
while (true) {
  const found = c.indexOf(a4, idxSearch);
  if (found === -1) break;
  count4++;
  idxSearch = found + a4.length;
}
if (count4 === 0) { console.log("FALHOU: 4 footer"); ok = false; }
else {
  c = c.split(a4).join("(filtroMesEmissao || filtroMesPagto.length > 0 || filtroTipo || filtroMesContb.length > 0)");
  console.log("OK 4: footer atualizado (" + count4 + " ocorrencias)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - filtro Contabilizacao agora e multi-select"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
