const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('r.numero_nf}</span></td>') && lines[i+1] && lines[i+1].includes('r.destinatario')) {
    lines.splice(i+1, 0, "                        <td style={tdBase({ textAlign: 'center', whiteSpace: 'nowrap', fontSize: '10px', padding: '8px 4px' })}><span style={{ borderRadius: '8px', padding: '1px 4px', background: (r.tipo||'saida')==='entrada' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)', color: (r.tipo||'saida')==='entrada' ? '#FBBF24' : '#34D399', fontWeight: 600 }}>{(r.tipo||'saida')==='entrada' ? 'E' : 'S'}</span></td>");
    console.log('OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
