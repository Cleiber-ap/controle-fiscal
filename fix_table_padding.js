const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split("padding: '5px 6px', textAlign: h === 'RB 12 meses (R$)' ? 'left' : 'right' as any").join(
  "padding: '5px 14px', textAlign: h === 'RB 12 meses (R$)' ? 'left' : 'right' as any"
);
c = c.split("padding: '5px 6px', color: ativa ? '#E8EAF0' : '#7B82A0'").join(
  "padding: '5px 14px', color: ativa ? '#E8EAF0' : '#7B82A0'"
);
c = c.split("padding: '5px 6px', textAlign: 'right' as any,color: ativa ? '#E8EAF0' : '#7B82A0'").join(
  "padding: '5px 14px', textAlign: 'right' as any,color: ativa ? '#E8EAF0' : '#7B82A0'"
);
c = c.split("padding: '5px 6px', textAlign: 'right' as any }").join(
  "padding: '5px 14px', textAlign: 'right' as any }"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
