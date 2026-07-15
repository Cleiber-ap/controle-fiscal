const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "borderRadius: '8px', background: (r.tipo||'saida')==='entrada' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)', color: (r.tipo||'saida')==='entrada' ? '#FBBF24' : '#34D399', fontWeight: 600 }}>";
const novo = "borderRadius: '8px', padding: '1px 3px', background: (r.tipo||'saida')==='entrada' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)', color: (r.tipo||'saida')==='entrada' ? '#FBBF24' : '#34D399', fontWeight: 600 }}>";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
c = c.replace("padding: '2px 6px', ", "");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
