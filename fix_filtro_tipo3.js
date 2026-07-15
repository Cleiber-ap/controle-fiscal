const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/notasFiltradas2\.map\(/g, 'notasFiltradas3.map(');
c = c.replace(/notasFiltradas2\.length/g, 'notasFiltradas3.length');
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
