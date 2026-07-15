const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

c = c.replace(
  'style={{ width: 18, height: 18, borderRadius: 4, border: \'1px solid #4A5070\', background: r.ajustado ? \'#34D399\' : \'#2A2D3E\', cursor: \'pointer\', padding: 0, display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}',
  'style={{ width: 14, height: 14, borderRadius: 3, border: \'1px solid #4A5070\', background: r.ajustado ? \'#34D399\' : \'#2A2D3E\', cursor: \'pointer\', padding: 0, display: \'flex\', alignItems: \'center\', justifyContent: \'center\' }}'
);

c = c.replace(
  '{r.ajustado && <span style={{ color: \'#0D0F17\', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>✓</span>}',
  '{r.ajustado && <span style={{ color: \'#0D0F17\', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}'
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
