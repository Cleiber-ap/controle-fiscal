const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

c = c.replace(
  "padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: stStyle.bg, color: stStyle.cor, display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'",
  "padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600, background: stStyle.bg, color: stStyle.cor, display: 'inline-flex', alignItems: 'center', gap: '4px', maxWidth: '90px'"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
