const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');
const idx = c.indexOf("const val = editPgtoVal.trim()");
const start = c.lastIndexOf('\n', idx);
const end = c.indexOf('\n', c.indexOf('response', idx) + 200);
console.log(JSON.stringify(c.slice(start, end)));
