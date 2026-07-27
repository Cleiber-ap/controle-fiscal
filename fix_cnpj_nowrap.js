const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Linha parcial
const anchor1 = "<td style={tdBase({ color: '#4A5070', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.replace(anchor1, "<td style={tdBase({ color: '#4A5070', ...mono, fontSize: '11px', whiteSpace: 'nowrap' })}>{fmtCNPJ(r.cnpj_dest)}</td>");
  console.log("OK: linha parcial corrigida");
}

// 2. Linha vazia (aguardando)
const anchor2 = "<td style={tdSm({ color: '#4A5070', ...mono, fontSize: '11px' })}>{fmtCNPJ(r.cnpj_dest)}</td>";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  c = c.replace(anchor2, "<td style={tdSm({ color: '#4A5070', ...mono, fontSize: '11px', whiteSpace: 'nowrap' })}>{fmtCNPJ(r.cnpj_dest)}</td>");
  console.log("OK: linha vazia corrigida");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
