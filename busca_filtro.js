const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const idx = c.indexOf('filtroMesPagto');
const start = c.lastIndexOf('\n', c.lastIndexOf('\n', idx) - 1);
const end = c.indexOf('\n', c.indexOf('\n', c.indexOf('\n', idx) + 1) + 1);
console.log(JSON.stringify(c.slice(start, end + 200)));
