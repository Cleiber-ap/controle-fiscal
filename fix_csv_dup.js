const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "      for (const n of planilhaNotas) {\n        await api.post('/notas/pagamento', {";
const novo = "      for (const n of planilhaNotas) {\n        if (n.ja_pago) { ok++; continue }\n        await api.post('/notas/pagamento', {";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
