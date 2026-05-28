const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "const isVenda = (r.nat_operacao || r.status || '').toLowerCase().includes('venda') && !foiCancelada"
).join(
  "const nat = (r.nat_operacao || r.status || '').toLowerCase()\n                  const isVenda = nat.includes('venda') && !nat.includes('devolu') && !foiCancelada"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
