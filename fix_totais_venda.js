const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
lines[769] = lines[769].replace(
  'notasFiltradas3.reduce((s:number,r:any) => s + (parseFloat(r.valor_nf)||0), 0)',
  "notasFiltradas3.filter((r:any) => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s:number,r:any) => s + (parseFloat(r.valor_nf)||0), 0)"
);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
