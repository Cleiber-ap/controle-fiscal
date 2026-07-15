const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "const val = !(r.ajustado || false); setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: val} : n)); await api.put('/notas/ajustado/' + r.id, { ajustado: val })";
const novo = "const val = !(ajustadosPg[pg.id] || false); setAjustadosPg(prev => ({...prev, [pg.id]: val})); await api.put('/notas/ajustado/' + r.id, { ajustado: val })";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
c = c.replace("r.ajustado ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.ajustado && <span", "ajustadosPg[pg.id] ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ajustadosPg[pg.id] && <span");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
