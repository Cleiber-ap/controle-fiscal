const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const tPago = notas.filter(r => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s, r) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    const dtPgto = r.dt_pagamento || r.data_pagamento\r\n" +
"    if (lista.length > 0) {\r\n" +
"      const somaParciais = lista.filter((p) => dtNoMesAnt(p.dt_pagamento)).reduce((a, p) => a + (parseFloat(p.valor_pago) || 0), 0)\r\n" +
"      const originalPago = (dtNoMesAnt(dtPgto) && !dtNoMesAnt(lista[0].dt_pagamento)) ? (parseFloat(lista[0].valor_pago) || 0) : 0\r\n" +
"      const totalParciais = lista.reduce((a, p) => a + (parseFloat(p.valor_pago) || 0), 0)\r\n" +
"      const notaPago = parseFloat(r.valor_pago) || 0\r\n" +
"      const extra = (notaPago > totalParciais && dtNoMesAnt(dtPgto)) ? (notaPago - totalParciais) : 0\r\n" +
"      return s + somaParciais\r\n" +
"    }\r\n" +
"    if (r.valor_pago && dtNoMesAnt(dtPgto)) return s + (parseFloat(r.valor_pago) || 0)\r\n" +
"    return s\r\n" +
"  }, 0)";

const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const tPago = notas.filter(r => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s, r) => {\r\n" +
"    const lista = pagamentos[r.numero_nf] || []\r\n" +
"    const dtContbNota = r.data_contabilizacao || ''\r\n" +
"    if (lista.length > 0) {\r\n" +
"      const somaParciais = lista.filter((p) => dtNoMesAnt(p.data_contabilizacao || '')).reduce((a, p) => a + (parseFloat(p.valor_pago) || 0), 0)\r\n" +
"      return s + somaParciais\r\n" +
"    }\r\n" +
"    if (r.valor_pago && dtNoMesAnt(dtContbNota)) return s + (parseFloat(r.valor_pago) || 0)\r\n" +
"    return s\r\n" +
"  }, 0)";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - tPago agora usa data_contabilizacao");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
