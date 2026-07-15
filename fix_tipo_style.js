const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "background: (r.tipo||'saida')==='entrada' ? 'rgba(79,142,247,0.15)' : 'rgba(52,211,153,0.15)', color: (r.tipo||'saida')==='entrada' ? '#4F8EF7' : '#34D399'";
const novo = "background: (r.tipo||'saida')==='entrada' ? 'rgba(251,191,36,0.15)' : 'rgba(52,211,153,0.15)', color: (r.tipo||'saida')==='entrada' ? '#FBBF24' : '#34D399'";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
c = c.replace("width: '60px', minWidth: '60px'", "width: '30px', minWidth: '30px'");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
