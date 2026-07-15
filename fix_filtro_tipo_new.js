const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// 1. Adicionar state
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('filtroMesEmissao') && lines[i].includes('useState')) {
    lines.splice(i+1, 0, "  const [filtroTipo, setFiltroTipo] = useState('')");
    console.log('State OK linha', i+2);
    break;
  }
}

// 2. Adicionar select no filtro
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Emiss') && lines[i].includes('</select>') && lines[i+1] && lines[i+1].trim() === '</div>') {
    lines.splice(i+1, 0, 
      "              <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>",
      "                <option value=''>Tipo: todos</option>",
      "                <option value='saida'>Sa\u00EDda</option>",
      "                <option value='entrada'>Entrada</option>",
      "              </select>"
    );
    console.log('Select OK linha', i+2);
    break;
  }
}

// 3. Adicionar filtro na lista
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const dtNoMesFiltro')) {
    lines.splice(i, 0, "  const notasFiltradas3 = filtroTipo ? notasFiltradas2.filter((r: any) => (r.tipo || 'saida') === filtroTipo) : notasFiltradas2");
    console.log('Filter OK linha', i+1);
    break;
  }
}

fs.writeFileSync(f, lines.join('\n'), 'utf8');
