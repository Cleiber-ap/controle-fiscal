const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx', 'utf8');
const idx = c.indexOf('Autorizar');
if (idx === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
const start = c.lastIndexOf('\n', c.lastIndexOf('\n', c.lastIndexOf('\n', idx) - 1) - 1);
const end = c.indexOf('\n', c.indexOf('\n', c.indexOf('\n', idx) + 1) + 1);
console.log(JSON.stringify(c.slice(start, end)));
