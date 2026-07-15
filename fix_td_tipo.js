const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "                        <td style={tdBase({ color: '#E8EAF0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{r.destinatario}</td>";
const novo = "                        <td style={tdBase({ textAlign: 'center', width: '60px', minWidth: '60px', whiteSpace: 'nowrap', fontSize: '10px' })}><span style={{ padding: '2px 6px', borderRadius: '8px', background: (r.tipo||'saida')==='entrada' ? 'rgba(79,142,247,0.15)' : 'rgba(52,211,153,0.15)', color: (r.tipo||'saida')==='entrada' ? '#4F8EF7' : '#34D399', fontWeight: 600 }}>{(r.tipo||'saida')==='entrada' ? 'E' : 'S'}</span></td>\n                        <td style={tdBase({ color: '#E8EAF0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{r.destinatario}</td>";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
