const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, background: stStyle.bg, color: stStyle.cor, display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '90px'";
const novo = "padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, background: stStyle.bg, color: stStyle.cor, display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '180px'";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
