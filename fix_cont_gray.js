const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split("valor: fmtR(base), cor: '#FBBF24'").join("valor: fmtR(base), cor: '#7B82A0'");
c = c.split("valor: fmtR(base * aliqEfetivaCont), cor: '#FBBF24'").join("valor: fmtR(base * aliqEfetivaCont), cor: '#7B82A0'");

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
