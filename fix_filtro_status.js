const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');

// 1. Adicionar state
lines.splice(56, 0, "  const [filtroStatus, setFiltroStatus] = useState('')");

// 2. Adicionar filtro após notasFiltradas3
for (let i = 207; i < 212; i++) {
  if (lines[i] && lines[i].includes('notasFiltradas3') && lines[i+1] && lines[i+1].includes('dtNoMesFiltro')) {
    lines.splice(i+1, 0, "  const notasFiltradas4 = filtroStatus ? notasFiltradas3.filter((r: any) => (r.nat_operacao || r.status || '') === filtroStatus) : notasFiltradas3");
    console.log('Filter OK linha', i+2);
    break;
  }
}

// 3. Substituir notasFiltradas3 por notasFiltradas4 no map
for (let i = 0; i < lines.length; i++) {
  if (lines[i] && lines[i].includes('notasFiltradas3.map(')) {
    lines[i] = lines[i].replace('notasFiltradas3.map(', 'notasFiltradas4.map(');
  }
  if (lines[i] && lines[i].includes('notasFiltradas3.length')) {
    lines[i] = lines[i].replace('notasFiltradas3.length', 'notasFiltradas4.length');
  }
}

// 4. Adicionar select após o filtro Tipo
for (let i = 444; i < 452; i++) {
  if (lines[i] && lines[i].trim() === '</select>' && lines[i+1] && lines[i+1].trim() === '</div>') {
    lines.splice(i+1, 0,
      "              <select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>",
      "                <option value=''>Status: todos</option>",
      "                <option value='Venda'>Venda</option>",
      "                <option value='Simples Remessa'>Simples Remessa</option>",
      "                <option value='Cancelamento'>Cancelamento</option>",
      "                <option value='Carta de Correcao'>Carta de Corre\u00e7\u00e3o</option>",
      "                <option value='Complemento de Frete'>Complemento de Frete</option>",
      "                <option value='Devolucao de venda de mercadorias'>Devolu\u00e7\u00e3o de Venda</option>",
      "                <option value='Devolucao de simples remessa'>Devolu\u00e7\u00e3o de Remessa</option>",
      "                <option value='Inutilizacao'>Inutiliza\u00e7\u00e3o</option>",
      "              </select>"
    );
    console.log('Select OK linha', i+2);
    break;
  }
}

fs.writeFileSync(f, lines.join('\n'), 'utf8');
