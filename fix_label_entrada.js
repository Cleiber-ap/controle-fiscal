const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar nfsCanReal (so -CAN de verdade) logo apos nfsCanceladas
const a1 = "const nfsCanceladas = new Set([...notas.filter(r => r.numero_nf?.endsWith('-CAN')).map(r => r.numero_nf.replace('-CAN', '')), ...ajustes.filter((aj: any) => aj.nf_referenciada).map((aj: any) => aj.nf_referenciada)])";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 nfsCanceladas"); ok = false; }
else {
  const n1 = a1 + "\r\n  const nfsCanReal = new Set(notas.filter(r => r.numero_nf?.endsWith('-CAN')).map(r => r.numero_nf.replace('-CAN', '')))";
  c = c.replace(a1, n1);
  console.log("OK 1: nfsCanReal adicionado");
}

// 2. Ajustar o rotulo exibido
const a2 = "{foiCancelada ? (r.nat_operacao || r.status || 'Sem status') + '/Cancelada' : (r.nat_operacao || r.status || 'Sem status')}";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 rotulo"); ok = false; }
else {
  const n2 = "{foiCancelada ? (r.nat_operacao || r.status || 'Sem status') + (nfsCanReal.has(r.numero_nf) ? '/Cancelada' : '/Entrada') : (r.nat_operacao || r.status || 'Sem status')}";
  c = c.replace(a2, n2);
  console.log("OK 2: rotulo diferenciado (/Cancelada vs /Entrada)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
