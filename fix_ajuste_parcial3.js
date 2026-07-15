const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "!(r.ajustado || false); await api.put('/notas/ajustado/' + r.id, { ajustado: val }); carregarTudo()";
const novo = "!(r.ajustado || false); setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: val} : n)); await api.put('/notas/ajustado/' + r.id, { ajustado: val })";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
