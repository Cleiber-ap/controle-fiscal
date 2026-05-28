const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split('Planilha_1').join('');
c = c.split(' â€" Planilha_1').join('');
c = c.split(' — Planilha_1').join('');
c = c.split('- Planilha_1').join('');

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
