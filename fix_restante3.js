const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "{temSaldoReal ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(saldoTotal)}</span> : (isPaga && restante > 0.01 ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(restante)}</span> : null)}";
const novo = "{isPaga && restante > 0.01 ? <span style={{ color: '#F87171', fontWeight: 600 }}>{fmtR(restante)}</span> : null}";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
