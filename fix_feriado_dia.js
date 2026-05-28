const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split("type='number' min='1' max='31'").join("type='text'");

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
