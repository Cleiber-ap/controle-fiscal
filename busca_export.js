const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', 'utf8');
const idx = c.indexOf('notasPagas');
const start = c.lastIndexOf('\n', idx);
const end = c.indexOf('\n', c.indexOf('})', idx) + 5);
console.log(JSON.stringify(c.slice(start, end)));
