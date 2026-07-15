const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace("!(pg.ajustado || false); await api.put('/notas/ajustado/' + pg.id", "!(r.ajustado || false); await api.put('/notas/ajustado/' + r.id");
c = c.replace("pg.ajustado ? '#34D399'", "r.ajustado ? '#34D399'");
c = c.replace("pg.ajustado && <span", "r.ajustado && <span");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
