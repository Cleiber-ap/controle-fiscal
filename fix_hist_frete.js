const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "todasNotas.filter((n: any) => (n.nat_operacao || n.status || '').toLowerCase().includes('venda') && !(n.nat_operacao || '').toLowerCase().includes('devolu'))";
const novo = "todasNotas.filter((n: any) => { const st = (n.nat_operacao || n.status || '').toLowerCase(); return (st.includes('venda') && !st.includes('devolu')) || st.includes('complemento de frete') })";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
