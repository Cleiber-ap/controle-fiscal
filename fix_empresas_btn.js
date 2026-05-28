const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Empresas/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
c = c.split("}}>x</button>").join("}}>\uD83D\uDDD1\uFE0F</button>");
fs.writeFileSync(p, c, 'utf8');
console.log('OK');
