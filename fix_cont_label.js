const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.replace('(aliqEfetivaCont * 100).toFixed(4)', '(aliqEfetivaCont * 100).toFixed(2)');
c = c.split('(D17)').join('');

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
