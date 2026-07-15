const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');

const old1 = "<td style={tdBase()}><span style={{ background: nfBg, color: nfCor, borderRadius: '5px', padding: '2px 8px', fontWeight: 700, fontSize: '12px', ...mono }}>{r.numero_nf}</span></td>";
const novo1 = "<td style={tdBase({ width: '70px', maxWidth: '70px' })}><span style={{ background: nfBg, color: nfCor, borderRadius: '5px', padding: '2px 8px', fontWeight: 700, fontSize: '12px', ...mono }}>{r.numero_nf}</span></td>";
if (c.indexOf(old1) === -1) { console.log('TRECHO 1 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old1, novo1);

const old2 = "<td style={tdBase({ textAlign: 'center' })}>\n                          {isVenda && <button";
const novo2 = "<td style={tdBase({ textAlign: 'center', width: '50px', maxWidth: '50px' })}>\n                          {isVenda && <button";
if (c.indexOf(old2) === -1) { console.log('TRECHO 2 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old2, novo2);

fs.writeFileSync(f, c, 'utf8');
console.log('OK');
