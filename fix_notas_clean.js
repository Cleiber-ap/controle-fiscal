const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/backend/app/routers/notas.py';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/\0/g, '');
fs.writeFileSync(f, c, 'utf8');
console.log('OK - null bytes removidos');
