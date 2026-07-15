const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 710; i < 720; i++) {
  if (lines[i] && lines[i].includes('Pagamento parcial {lista.length + 1}')) {
    lines[i] = lines[i].replace("tdSm({ color: '#7B82A0', fontSize: '11px', fontStyle: 'italic' })", "tdSm({ color: '#7B82A0', fontSize: '11px', fontStyle: 'italic', whiteSpace: 'nowrap' })");
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
