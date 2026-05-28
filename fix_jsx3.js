const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/\s*\)\}\s*\n\s*\)\}\s*\n(\s*<\/div>)/, '\n      )}\n$1');
fs.writeFileSync(p, c, 'utf8');
console.log('OK');
