const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// Remover bloco breadcrumb completo
c = c.replace(/\s*\{\/\* Breadcrumb \*\/\}\s*<div[\s\S]*?<\/div>\s*\n/, '\n');

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
