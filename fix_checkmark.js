const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("r.ajustado && <span style={{ color: '#0D0F17', fontSize: 10, fontWeight: 700 }}>?</span>", "r.ajustado && <span style={{ color: '#0D0F17', fontSize: 10, fontWeight: 700 }}>\u2713</span>");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
