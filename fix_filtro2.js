const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// 1. Adicionar estado filtroMesEmissao
const stateOld = "const [filtroMesPagto, setFiltroMesPagto] = useState('')";
const stateNew = "const [filtroMesPagto, setFiltroMesPagto] = useState('')\n  const [filtroMesEmissao, setFiltroMesEmissao] = useState('')";
if (!c.includes(stateOld)) { console.log('NAO ENCONTRADO: state'); process.exit(1); }
c = c.replace(stateOld, stateNew);

// 2. Adicionar filtro de emissão após notasFiltradas
const filtroOld = "    : ultimos4";
const filtroNew = `    : ultimos4

  const notasFiltradas2 = filtroMesEmissao
    ? notasFiltradas.filter(r => {
        const dt = r.data_emissao || ''
        const parts = dt.includes('-') ? dt.split('-').reverse() : dt.split('/')
        const mm = parts[1]?.padStart(2, '0')
        const aa = parts[2]
        return (mm + '/' + aa) === filtroMesEmissao
      })
    : notasFiltradas`;
if (!c.includes(filtroOld)) { console.log('NAO ENCONTRADO: filtro'); process.exit(1); }
c = c.replace(filtroOld, filtroNew);

// 3. Usar notasFiltradas2 no map da tabela
c = c.replace('{notasFiltradas.map(r => {', '{notasFiltradas2.map(r => {');

// 4. Atualizar contador
c = c.replace('>{notasFiltradas.length} notas', '>{notasFiltradas2.length} notas');

// 5. Adicionar select de emissão - usar trecho exato com \r\n
const idxTodosOsMeses = c.indexOf('Todos os meses');
const idxEndSelect = c.indexOf('</select>', idxTodosOsMeses) + '</select>'.length;
const afterSelect = c.slice(idxEndSelect, idxEndSelect + 5); // deve ser \r\n ou \n

const novoSelect = `
              <select value={filtroMesEmissao} onChange={e=>setFiltroMesEmissao(e.target.value)} style={{ background:'#1A1D2A', color:'#E8EAF0', border:'1px solid #353849', borderRadius:6, padding:'2px 8px', fontSize:'12px', cursor:'pointer' }}>
                <option value="">Emissão: todos</option>
                {[...new Set(notas.map((r:any)=>{ const dt=r.data_emissao||''; if(!dt) return null; const parts=dt.includes('-')?dt.split('-').reverse():dt.split('/'); const mm=parts[1]; const aa=parts[2]; return (mm&&aa&&!isNaN(+mm)&&!isNaN(+aa)) ? mm.padStart(2,'0')+'/'+aa : null }).filter(Boolean))].sort().map((m:any)=>(<option key={m} value={m}>{m}</option>))}
              </select>`;

c = c.slice(0, idxEndSelect) + novoSelect + c.slice(idxEndSelect);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
