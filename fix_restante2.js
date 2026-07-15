const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "const restante = valorNF - totalPago  // exibido na coluna Restante da linha original";
const novo = "const restante = valorNF - primeiroPagamento  // exibido na coluna Restante da linha original";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
