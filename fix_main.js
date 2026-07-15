const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/main.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/\0/g, '');
const lastClose = c.lastIndexOf('\n)');
c = c.substring(0, lastClose + 2) + '\n';
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
