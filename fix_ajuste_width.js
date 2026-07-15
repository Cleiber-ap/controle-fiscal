const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[482] = lines[482].replace("textAlign: 'center' as const }}>Ajuste</th>", "textAlign: 'center' as const, width: '40px' }}>Ajuste</th>");
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
