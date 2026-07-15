const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const idx = c.indexOf('Total SIX/ENOVA');
const start = c.lastIndexOf('\n', c.lastIndexOf('\n', idx) - 1);
const end = c.indexOf('\n', c.indexOf("'#A78BFA' }", idx) + 50);
console.log(JSON.stringify(c.slice(start, end + 10)));
