const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const idx = c.indexOf("tdBase({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{temHistorico");
const start = c.lastIndexOf('\n', idx);
const end = c.indexOf('\n', idx + 150);
console.log(JSON.stringify(c.slice(start, end)));
