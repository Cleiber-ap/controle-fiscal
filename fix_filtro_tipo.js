const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '</select>' && lines[i+1] && lines[i+1].trim() === '</div>' && lines[i+2] && lines[i+2].trim() === '</div>' && lines[i+3] && lines[i+3].includes('devElegiveis')) {
    lines.splice(i+1, 0, '              <select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)} style={{ background:\'#1A1D2A\', color:\'#E8EAF0\', border:\'1px solid #353849\', borderRadius:6, padding:\'2px 8px\', fontSize:\'12px\', cursor:\'pointer\' }}>',
      '                <option value="">Tipo: todos</option>',
      '                <option value="saida">Saída</option>',
      '                <option value="entrada">Entrada</option>',
      '              </select>');
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
