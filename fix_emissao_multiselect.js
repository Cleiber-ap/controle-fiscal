const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. State
const a1 = "const [filtroMesEmissao, setFiltroMesEmissao] = useState('')";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 state"); ok = false; }
else {
  c = c.slice(0, i1) + "const [filtroMesEmissao, setFiltroMesEmissao] = useState<string[]>([])\r\n  const [showEmissaoMenu, setShowEmissaoMenu] = useState(false)" + c.slice(i1 + a1.length);
  console.log("OK 1: state convertido para array");
}

// 2. notasFiltradas2
const a2 = "const notasFiltradas2 = filtroMesEmissao\r\n" +
"    ? notasFiltradas.filter(r => {\r\n" +
"        const dt = r.data_emissao || ''\r\n" +
"        const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2, '0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return (mm + '/' + aa) === filtroMesEmissao\r\n" +
"      })\r\n" +
"    : notasFiltradas";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 notasFiltradas2"); ok = false; }
else {
  const n2 = "const notasFiltradas2 = filtroMesEmissao.length > 0\r\n" +
"    ? notasFiltradas.filter(r => {\r\n" +
"        const dt = r.data_emissao || ''\r\n" +
"        if (!dt) return false\r\n" +
"        const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')\r\n" +
"        const mm = parts[1]?.padStart(2, '0')\r\n" +
"        const aa = parts[2]\r\n" +
"        return filtroMesEmissao.includes(mm + '/' + aa)\r\n" +
"      })\r\n" +
"    : notasFiltradas";
  c = c.slice(0, i2) + n2 + c.slice(i2 + a2.length);
  console.log("OK 2: notasFiltradas2 atualizado");
}

// 3. Trocar select por botao + checkboxes
const a3 = "<select value={filtroMesEmissao} onChange={e=>setFiltroMesEmissao(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>\r\n" +
"                <option value=\"\">Emissão: todos</option>\r\n" +
"                {[...new Set(notas.map((r:any)=>{ const dt=r.data_emissao||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean))].sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}\r\n" +
"              </select>";
const i3 = c.indexOf(a3);
if (i3 === -1) { console.log("FALHOU: 3 select UI"); ok = false; }
else {
  const n3 = "<div style={{ position: 'relative' }}>\r\n" +
"                <button onClick={() => setShowEmissaoMenu(p => !p)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>\r\n" +
"                  {filtroMesEmissao.length === 0 ? 'Emissão: todos' : `Emissão: ${filtroMesEmissao.length} selecionado${filtroMesEmissao.length>1?'s':''}`}\r\n" +
"                </button>\r\n" +
"                {showEmissaoMenu && (<div style={{ position:'absolute', top:'100%', left:0, zIndex:100, background:'#1A1D2A', border:'1px solid #353849', borderRadius:6, padding:'4px 0', minWidth:'160px', maxHeight:'260px', overflowY:'auto' }}>\r\n" +
"                  {[...new Set(notas.map((r:any)=>{ const dt=r.data_emissao||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean))].sort().map((m:any)=>(\r\n" +
"                    <label key={m} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', cursor:'pointer', color:'#E8EAF0', fontSize:'12px' }}>\r\n" +
"                      <input type='checkbox' checked={filtroMesEmissao.includes(m)} onChange={e => setFiltroMesEmissao(prev => e.target.checked ? [...prev, m] : prev.filter(x => x !== m))} />\r\n" +
"                      {m}\r\n" +
"                    </label>\r\n" +
"                  ))}\r\n" +
"                  <div style={{ borderTop:'1px solid #353849', margin:'4px 0', padding:'4px 12px' }}>\r\n" +
"                    <button onClick={() => { setFiltroMesEmissao([]); setShowEmissaoMenu(false) }} style={{ fontSize:'11px', color:'#7B82A0', background:'none', border:'none', cursor:'pointer' }}>Limpar</button>\r\n" +
"                    <button onClick={() => setShowEmissaoMenu(false)} style={{ fontSize:'11px', color:'#34D399', background:'none', border:'none', cursor:'pointer', marginLeft:8 }}>Fechar</button>\r\n" +
"                  </div>\r\n" +
"                </div>)}\r\n" +
"              </div>";
  c = c.slice(0, i3) + n3 + c.slice(i3 + a3.length);
  console.log("OK 3: select trocado por botao + checkboxes");
}

// 4. Footer (2 ocorrencias)
const a4 = "(filtroMesEmissao || filtroMesPagto.length > 0 || filtroTipo || filtroMesContb.length > 0)";
let count4 = 0, idxSearch = 0;
while (true) {
  const found = c.indexOf(a4, idxSearch);
  if (found === -1) break;
  count4++;
  idxSearch = found + a4.length;
}
if (count4 === 0) { console.log("FALHOU: 4 footer"); ok = false; }
else {
  c = c.split(a4).join("(filtroMesEmissao.length > 0 || filtroMesPagto.length > 0 || filtroTipo || filtroMesContb.length > 0)");
  console.log("OK 4: footer atualizado (" + count4 + " ocorrencias)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - filtro Emissao agora e multi-select"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
