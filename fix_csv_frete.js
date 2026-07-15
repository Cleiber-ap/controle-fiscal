const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "const isVenda = (n.nat_operacao || n.status || '').toLowerCase().includes('venda')";
const novo = "const nat = (n.nat_operacao || n.status || '').toLowerCase(); const isVenda = nat.includes('venda') || nat.includes('complemento de frete')";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
