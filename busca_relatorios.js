const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Relatorios/index.tsx', 'utf8');
const idx = c.indexOf('Comparativo Anual');
const start = c.lastIndexOf('\n', c.lastIndexOf('\n', idx) - 1);
const end = c.indexOf('\n', c.indexOf('Impostos', idx) + 100);
console.log(JSON.stringify(c.slice(start, end + 10)));
