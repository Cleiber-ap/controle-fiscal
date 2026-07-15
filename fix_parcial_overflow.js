const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Pagamento parcial {idx + 2}') && lines[i].includes('tdBase')) {
    lines[i] = lines[i].replace(
      "tdBase({ color: '#7B82A0', fontSize: '11px', fontStyle: 'italic', width: '180px', minWidth: '180px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis' })",
      "tdBase({ color: '#7B82A0', fontSize: '11px', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })"
    );
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
