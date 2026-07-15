const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines.splice(721, 0, "                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}>—</td>");
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
