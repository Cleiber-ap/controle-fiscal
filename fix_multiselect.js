const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// 1. Trocar state de string para array
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const [filtroStatus, setFiltroStatus] = useState('')")) {
    lines[i] = "  const [filtroStatus, setFiltroStatus] = useState<string[]>([])";
    lines.splice(i+1, 0, "  const [showStatusMenu, setShowStatusMenu] = useState(false)");
    console.log('State OK');
    break;
  }
}

// 2. Trocar filtro para array
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("filtroStatus ? notasFiltradas3.filter")) {
    lines[i] = "  const notasFiltradas4 = filtroStatus.length > 0 ? notasFiltradas3.filter((r: any) => filtroStatus.includes(r.nat_operacao || r.status || '')) : notasFiltradas3";
    console.log('Filter OK');
    break;
  }
}

// 3. Substituir select por dropdown multi-select
const STATUS_LIST = ['Venda','Simples Remessa','Cancelamento','Carta de Correcao','Complemento de Frete','Devolucao de venda de mercadorias','Devolucao de simples remessa','Inutilizacao'];
const STATUS_LABEL = {'Venda':'Venda','Simples Remessa':'Simples Remessa','Cancelamento':'Cancelamento','Carta de Correcao':'Carta de Corre\u00e7\u00e3o','Complemento de Frete':'Complemento de Frete','Devolucao de venda de mercadorias':'Devolu\u00e7\u00e3o de Venda','Devolucao de simples remessa':'Devolu\u00e7\u00e3o de Remessa','Inutilizacao':'Inutiliza\u00e7\u00e3o'};

// Achar inicio do select Status
let startIdx = -1, endIdx = -1;
for (let i = 450; i < 470; i++) {
  if (lines[i] && lines[i].includes("filtroStatus") && lines[i].includes('<select')) { startIdx = i; }
  if (startIdx > -1 && lines[i] && lines[i].includes('</select>') && i > startIdx) { endIdx = i; break; }
}
console.log('select:', startIdx, endIdx);
if (startIdx > -1 && endIdx > -1) {
  const newSelect = [
    "              <div style={{ position: 'relative' }}>",
    "                <button onClick={() => setShowStatusMenu(p => !p)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>",
    "                  {filtroStatus.length === 0 ? 'Status: todos' : `Status: ${filtroStatus.length} selecionado${filtroStatus.length>1?'s':''}`}",
    "                </button>",
    "                {showStatusMenu && (<div style={{ position:'absolute', top:'100%', left:0, zIndex:100, background:'#1A1D2A', border:'1px solid #353849', borderRadius:6, padding:'4px 0', minWidth:'200px' }}>",
    "                  {['Venda','Simples Remessa','Cancelamento','Carta de Correcao','Complemento de Frete','Devolucao de venda de mercadorias','Devolucao de simples remessa','Inutilizacao'].map(s => (",
    "                    <label key={s} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', cursor:'pointer', color:'#E8EAF0', fontSize:'12px' }}>",
    "                      <input type='checkbox' checked={filtroStatus.includes(s)} onChange={e => setFiltroStatus(prev => e.target.checked ? [...prev, s] : prev.filter(x => x !== s))} />",
    "                      {s === 'Carta de Correcao' ? 'Carta de Corre\u00e7\u00e3o' : s === 'Devolucao de venda de mercadorias' ? 'Devolu\u00e7\u00e3o de Venda' : s === 'Devolucao de simples remessa' ? 'Devolu\u00e7\u00e3o de Remessa' : s === 'Inutilizacao' ? 'Inutiliza\u00e7\u00e3o' : s}",
    "                    </label>",
    "                  ))}",
    "                  <div style={{ borderTop:'1px solid #353849', margin:'4px 0', padding:'4px 12px' }}>",
    "                    <button onClick={() => { setFiltroStatus([]); setShowStatusMenu(false) }} style={{ fontSize:'11px', color:'#7B82A0', background:'none', border:'none', cursor:'pointer' }}>Limpar</button>",
    "                  </div>",
    "                </div>)}",
    "              </div>",
  ];
  lines.splice(startIdx, endIdx - startIdx + 1, ...newSelect);
  console.log('Select OK');
}

fs.writeFileSync(f, lines.join('\n'), 'utf8');
