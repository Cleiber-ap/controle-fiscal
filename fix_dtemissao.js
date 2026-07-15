const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
// Inserir Dt Emissao antes do Valor Pago (linha 655, index 655)
lines.splice(655, 0, "                              <td style={tdBase({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{r.data_emissao || '—'}</td>");
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
