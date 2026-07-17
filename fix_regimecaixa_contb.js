const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const tPagoPorDtPagamento = notas.filter(r => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s, r) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    if (lista.length > 0) {\r\n" +
"      const soma = lista.filter((p: any) => { const dt = p.dt_pagamento||''; const parts = dt.includes('-')?dt.split('-').reverse():dt.split('/'); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[2])===anoAnt }).reduce((a: number, p: any) => a + (parseFloat(p.valor_pago) || 0), 0)\r\n" +
"      return s + soma\r\n" +
"    }\r\n" +
"    const dtP = r.dt_pagamento||r.data_pagamento||''; const partsP = dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); if(parseInt(partsP[1])===mesAntIdx+1&&parseInt(partsP[2])===anoAnt) return s + (parseFloat(r.valor_pago) || 0)\r\n" +
"    return s\r\n" +
"  }, 0)";

const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const tPagoPorDtPagamento = notas.filter(r => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s, r) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    if (lista.length > 0) {\r\n" +
"      const soma = lista.filter((p: any) => { const dt = p.data_contabilizacao||''; const parts = dt.includes('-')?dt.split('-').reverse():dt.split('/'); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[2])===anoAnt }).reduce((a: number, p: any) => a + (parseFloat(p.valor_pago) || 0), 0)\r\n" +
"      return s + soma\r\n" +
"    }\r\n" +
"    const dtP = r.data_contabilizacao||''; const partsP = dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); if(parseInt(partsP[1])===mesAntIdx+1&&parseInt(partsP[2])===anoAnt) return s + (parseFloat(r.valor_pago) || 0)\r\n" +
"    return s\r\n" +
"  }, 0)";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - tPagoPorDtPagamento agora usa data_contabilizacao");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
