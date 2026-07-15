const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', 'utf8');
const idx = c.indexOf('pgtoPromises');
const start = c.lastIndexOf('\n', c.lastIndexOf('\n', idx) - 1);
const end = c.indexOf('\n', c.indexOf('setPagamentos', idx) + 50);
console.log(JSON.stringify(c.slice(start, end)));
