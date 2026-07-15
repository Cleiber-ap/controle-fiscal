const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(
  "onClick={async () => { const val = !(r.ajustado || false); await api.put('/notas/ajustado/' + r.id",
  "onClick={async (e) => { e.preventDefault(); e.stopPropagation(); const val = !(r.ajustado || false); await api.put('/notas/ajustado/' + r.id"
);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
