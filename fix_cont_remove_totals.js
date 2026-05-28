const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.replace(
  /\s*<span style=\{\{ fontSize: '11px', color: '#7B82A0' \}\}>\s*\n\s*Total NF:[\s\S]*?<\/span>\s*\n\s*<\/span>/,
  ''
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
