const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. State: string -> string[]
const a1 = "const [filtroMesPagto, setFiltroMesPagto] = useState('')";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 state"); ok = false; }
else {
  c = c.slice(0, i1) + "const [filtroMesPagto, setFiltroMesPagto] = useState<string[]>([])\r\n  const [showPagtoMenu, setShowPagtoMenu] = useState(false)" + c.slice(i1 + a1.length);
  console.log("OK 1: state convertido para array");
}

// 2. notasFiltradas
const a2 = "const notasFiltradas = filtroMesPagto\r\n" +
"    ? ultimos4.filter(r => {\r\n" +
"        const lista = pagamentos[r.numero_nf] || []\r\n" +
"        const dtPgto = r.dt_pagamento || r.data_pagamento\r\n" +
"        if (filtroMesPagto === '__VAZIO__') {\r\n" +
"          return lista.length === 0 && !dtPgto\r\n" +
"        }\r\n" +
"        if (lista.length > 0) {\r\n" +
"          return lista.some((p: any) => {\r\n" +
"            const dt = p.dt_pagamento || ''\r\n" +
"            const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"            const mm = parts[1]?.padStart(2,'0')\r\n" +
"            const aa = parts[2]\r\n" +
"            return (mm + '/' + aa) === filtroMesPagto\r\n" +
"          })\r\n" +
"        }\r\n" +
"        if (!dtPgto) return false\r\n" +
"        const parts = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return (mm + '/' + aa) === filtroMesPagto\r\n" +
"      })\r\n" +
"    : ultimos4";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 notasFiltradas"); ok = false; }
else {
  const n2 = "const notasFiltradas = filtroMesPagto.length > 0\r\n" +
"    ? ultimos4.filter(r => {\r\n" +
"        const lista = pagamentos[r.numero_nf] || []\r\n" +
"        const dtPgto = r.dt_pagamento || r.data_pagamento\r\n" +
"        if (lista.length > 0) {\r\n" +
"          return lista.some((p: any) => {\r\n" +
"            if (!p.dt_pagamento) return filtroMesPagto.includes('__VAZIO__')\r\n" +
"            const parts = p.dt_pagamento.includes('-') ? p.dt_pagamento.split('-').reverse() : p.dt_pagamento.split('/')\r\n" +
"            const mm = parts[1]?.padStart(2,'0')\r\n" +
"            const aa = parts[2]\r\n" +
"            return filtroMesPagto.includes(mm + '/' + aa)\r\n" +
"          })\r\n" +
"        }\r\n" +
"        if (!dtPgto) return filtroMesPagto.includes('__VAZIO__')\r\n" +
"        const parts = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2,'0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return filtroMesPagto.includes(mm + '/' + aa)\r\n" +
"      })\r\n" +
"    : ultimos4";
  c = c.slice(0, i2) + n2 + c.slice(i2 + a2.length);
  console.log("OK 2: notasFiltradas atualizado");
}

// 3. dtNoMesFiltro
const a3 = "const dtNoMesFiltro = (dtStr: string | undefined) => {\r\n" +
"    if (!filtroMesPagto) return true\r\n" +
"    if (filtroMesPagto === '__VAZIO__') return !dtStr\r\n" +
"    if (!dtStr) return false\r\n";
const i3 = c.indexOf(a3);
if (i3 === -1) { console.log("FALHOU: 3 dtNoMesFiltro"); ok = false; }
else {
  const n3 = "const dtNoMesFiltro = (dtStr: string | undefined) => {\r\n" +
"    if (filtroMesPagto.length === 0) return true\r\n" +
"    if (!dtStr) return filtroMesPagto.includes('__VAZIO__')\r\n";
  c = c.slice(0, i3) + n3 + c.slice(i3 + a3.length);
  console.log("OK 3: dtNoMesFiltro atualizado");
}

// 4. Ultima linha do dtNoMesFiltro
const a4 = "return (mm + '/' + aa) === filtroMesPagto\r\n  }";
const i4 = c.indexOf(a4);
if (i4 === -1) { console.log("FALHOU: 4 ultima linha"); ok = false; }
else {
  c = c.replace(a4, "return filtroMesPagto.includes(mm + '/' + aa)\r\n  }");
  console.log("OK 4: retorno final do dtNoMesFiltro");
}

// 5. Trocar o <select> por botao + menu de checkboxes
const a5 = "<select value={filtroMesPagto} onChange={e=>setFiltroMesPagto(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>\r\n" +
"                <option value=\"\">Pagamento: todos</option>\r\n" +
"                <option value=\"__VAZIO__\">Sem pagamento</option>\r\n" +
"                {[...new Set(notas.flatMap((r:any)=>{\r\n" +
"                  const lista=pagamentos[r.numero_nf]||[]\r\n" +
"                  if(lista.length>0) return lista.map((p:any)=>{ const dt=p.dt_pagamento||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean)\r\n" +
"                  const dtP=r.dt_pagamento||r.data_pagamento||''; if(!dtP) return []; const parts=dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? [mm.padStart(2,'0')+'/'+aa] : []\r\n" +
"                }))].filter(Boolean).sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}\r\n" +
"              </select>";
const i5 = c.indexOf(a5);
if (i5 === -1) { console.log("FALHOU: 5 select UI"); ok = false; }
else {
  const n5 = "<div style={{ position: 'relative' }}>\r\n" +
"                <button onClick={() => setShowPagtoMenu(p => !p)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>\r\n" +
"                  {filtroMesPagto.length === 0 ? 'Pagamento: todos' : `Pagamento: ${filtroMesPagto.length} selecionado${filtroMesPagto.length>1?'s':''}`}\r\n" +
"                </button>\r\n" +
"                {showPagtoMenu && (<div style={{ position:'absolute', top:'100%', left:0, zIndex:100, background:'#1A1D2A', border:'1px solid #353849', borderRadius:6, padding:'4px 0', minWidth:'160px', maxHeight:'260px', overflowY:'auto' }}>\r\n" +
"                  <label style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', cursor:'pointer', color:'#E8EAF0', fontSize:'12px' }}>\r\n" +
"                    <input type='checkbox' checked={filtroMesPagto.includes('__VAZIO__')} onChange={e => setFiltroMesPagto(prev => e.target.checked ? [...prev, '__VAZIO__'] : prev.filter(x => x !== '__VAZIO__'))} />\r\n" +
"                    Sem pagamento\r\n" +
"                  </label>\r\n" +
"                  {[...new Set(notas.flatMap((r:any)=>{\r\n" +
"                    const lista=pagamentos[r.numero_nf]||[]\r\n" +
"                    if(lista.length>0) return lista.map((p:any)=>{ const dt=p.dt_pagamento||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean)\r\n" +
"                    const dtP=r.dt_pagamento||r.data_pagamento||''; if(!dtP) return []; const parts=dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? [mm.padStart(2,'0')+'/'+aa] : []\r\n" +
"                  }))].filter(Boolean).sort().map((m:any)=>(\r\n" +
"                    <label key={m} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', cursor:'pointer', color:'#E8EAF0', fontSize:'12px' }}>\r\n" +
"                      <input type='checkbox' checked={filtroMesPagto.includes(m)} onChange={e => setFiltroMesPagto(prev => e.target.checked ? [...prev, m] : prev.filter(x => x !== m))} />\r\n" +
"                      {m}\r\n" +
"                    </label>\r\n" +
"                  ))}\r\n" +
"                  <div style={{ borderTop:'1px solid #353849', margin:'4px 0', padding:'4px 12px' }}>\r\n" +
"                    <button onClick={() => { setFiltroMesPagto([]); setShowPagtoMenu(false) }} style={{ fontSize:'11px', color:'#7B82A0', background:'none', border:'none', cursor:'pointer' }}>Limpar</button>\r\n" +
"                    <button onClick={() => setShowPagtoMenu(false)} style={{ fontSize:'11px', color:'#34D399', background:'none', border:'none', cursor:'pointer', marginLeft:8 }}>Aplicar</button>\r\n" +
"                  </div>\r\n" +
"                </div>)}\r\n" +
"              </div>";
  c = c.slice(0, i5) + n5 + c.slice(i5 + a5.length);
  console.log("OK 5: select trocado por botao + checkboxes");
}

// 6. linhaOriginalNoFiltro
const a6 = "const linhaOriginalNoFiltro = !filtroMesPagto || dtNoMesFiltro(dtLinhaOriginal)";
const i6 = c.indexOf(a6);
if (i6 === -1) { console.log("FALHOU: 6 linhaOriginalNoFiltro"); ok = false; }
else {
  c = c.replace(a6, "const linhaOriginalNoFiltro = filtroMesPagto.length === 0 || dtNoMesFiltro(dtLinhaOriginal)");
  console.log("OK 6: linhaOriginalNoFiltro atualizado");
}

// 7. filter de parciais
const a7 = "lista.slice(1).filter((pg: any) => !filtroMesPagto || dtNoMesFiltro(pg.dt_pagamento))";
const i7 = c.indexOf(a7);
if (i7 === -1) { console.log("FALHOU: 7 filter parciais"); ok = false; }
else {
  c = c.replace(a7, "lista.slice(1).filter((pg: any) => filtroMesPagto.length === 0 || dtNoMesFiltro(pg.dt_pagamento))");
  console.log("OK 7: filter de parciais atualizado");
}

// 8. mostrarProxima
const a8 = "{mostrarProxima && !filtroMesPagto && (";
const i8 = c.indexOf(a8);
if (i8 === -1) { console.log("FALHOU: 8 mostrarProxima"); ok = false; }
else {
  c = c.replace(a8, "{mostrarProxima && filtroMesPagto.length === 0 && (");
  console.log("OK 8: mostrarProxima atualizado");
}

// 9 e 10. Footer (2 ocorrencias identicas do trecho de condicao)
const a9 = "(filtroMesEmissao || filtroMesPagto || filtroTipo || filtroMesContb)";
let count9 = 0;
let idxSearch = 0;
while (true) {
  const found = c.indexOf(a9, idxSearch);
  if (found === -1) break;
  count9++;
  idxSearch = found + a9.length;
}
if (count9 === 0) { console.log("FALHOU: 9 footer (nenhuma ocorrencia)"); ok = false; }
else {
  c = c.split(a9).join("(filtroMesEmissao || filtroMesPagto.length > 0 || filtroTipo || filtroMesContb)");
  console.log("OK 9: footer atualizado (" + count9 + " ocorrencias)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - filtro Pagamento agora e multi-select"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
