const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "const tdSm = (extra?: any) => ({ padding: '5px 12px', borderBottom: '1px solid #1A1D2A', ...extra })";
const novo = "const tdSm = (extra?: any) => ({ padding: '5px 12px', borderBottom: '1px solid #1A1D2A', whiteSpace: 'nowrap', ...extra })";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
c = c.replace("})}>{r.destinatario} — Pagamento parcial {idx + 2}</td>", "})}><span style={{overflow:'hidden',textOverflow:'ellipsis',maxWidth:'160px',display:'inline-block'}}>{r.destinatario}</span> — Parcial {idx + 2}</td>");
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
