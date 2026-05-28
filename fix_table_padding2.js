const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split("padding: '5px 14px'").join("padding: '5px 32px'");

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
