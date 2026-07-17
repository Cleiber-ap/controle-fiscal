const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const nfsAberto = notas.filter(r => (r.nat_operacao || r.status || '\'\').toLowerCase().includes('\'venda'\') && !nfsCanceladas.has(r.numero_nf))";
const anchorReal = "const nfsAberto = notas.filter(r => (r.nat_operacao || r.status || \x27\x27).toLowerCase().includes(\x27venda\x27) && !nfsCanceladas.has(r.numero_nf))";
const idx = c.indexOf(anchorReal);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const nfsAberto = notas.filter(r => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf))";
  c = c.slice(0, idx) + novo + c.slice(idx + anchorReal.length);
  console.log("OK - nfsAberto agora usa isVendaOuParcial (Venda + Complemento de Frete, exclui devolucao)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
