const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// Reduzir padding das celulas da tabela Simples Nacional
c = c.split("padding: '7px 10px', textAlign: h === 'RB 12 meses (R$)' ? 'left' : 'right' as any").join(
  "padding: '5px 6px', textAlign: h === 'RB 12 meses (R$)' ? 'left' : 'right' as any"
);
c = c.split("padding: '7px 10px', color: ativa ? '#E8EAF0' : '#7B82A0'").join(
  "padding: '5px 6px', color: ativa ? '#E8EAF0' : '#7B82A0'"
);
c = c.split("padding: '7px 10px', textAlign: 'right' as any,color: ativa ? '#E8EAF0' : '#7B82A0'").join(
  "padding: '5px 6px', textAlign: 'right' as any,color: ativa ? '#E8EAF0' : '#7B82A0'"
);
c = c.split("padding: '7px 10px', textAlign: 'right' as any }").join(
  "padding: '5px 6px', textAlign: 'right' as any }"
);

// Reduzir font-size da tabela
c = c.split("fontSize: '11px' }}>{(f.aliq*100)").join("fontSize: '11px' }}>{(f.aliq*100)");

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
