const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
c = c.split("valor: (aliqEfetivaCont * 100).toFixed(2).replace('.', ',') + '%', cor: '#FBBF24'")
     .join("valor: (aliqEfetivaCont * 100).toFixed(2).replace('.', ',') + '%', cor: '#4F8EF7'");
fs.writeFileSync(p, c, 'utf8');
console.log('OK');
