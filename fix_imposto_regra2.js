const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// BLOCO 1 - linha original
const anchor1 = "                            const dtPg = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')\r\n" +
"                            const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')\r\n" +
"                            const mm = parseInt(parts[1])\r\n" +
"                            const aa = parseInt(parts[2])\r\n" +
"                            const now2 = new Date(); const mesCont = now2.getMonth() + 1; const anoCont = now2.getFullYear(); if (((mm === mesAntIdx + 1 && aa === anoAnt) || (mm === mesCont && aa === anoCont)) && primeiroPagamento > 0) {\r\n" +
"                              return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>\r\n" +
"                            }";

const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = "                            const dtContb = temHistorico ? (lista[0]?.data_contabilizacao || '') : (r.data_contabilizacao || '')\r\n" +
"                            const dtPgto = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')\r\n" +
"                            const partsC = dtContb.includes('-') ? dtContb.split('-').reverse() : dtContb.split('/')\r\n" +
"                            const mmC = parseInt(partsC[1]); const aaC = parseInt(partsC[2])\r\n" +
"                            const partsP = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')\r\n" +
"                            const mmP = parseInt(partsP[1]); const aaP = parseInt(partsP[2])\r\n" +
"                            const now2 = new Date(); const mesCont = now2.getMonth() + 1; const anoCont = now2.getFullYear()\r\n" +
"                            const condMesAnt = !!(dtContb && mmC === mesAntIdx + 1 && aaC === anoAnt)\r\n" +
"                            const condMesAtual = dtContb ? (mmC === mesCont && aaC === anoCont) : (mmP === mesCont && aaP === anoCont)\r\n" +
"                            if ((condMesAnt || condMesAtual) && primeiroPagamento > 0) {\r\n" +
"                              return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>\r\n" +
"                            }";
  c = c.slice(0, idx1) + novo1 + c.slice(idx1 + anchor1.length);
  console.log("OK bloco original");
}

// BLOCO 2 - linha parcial
const anchor2 = "                                  const dtPg = pg.dt_pagamento || ''\r\n" +
"                                  const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')\r\n" +
"                                  const mm = parseInt(parts[1])\r\n" +
"                                  const aa = parseInt(parts[2])\r\n" +
"                                  if (mm === mesAntIdx + 1 && aa === anoAnt && pg.valor_pago > 0) {\r\n" +
"                                    return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>\r\n" +
"                                  }";

const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "                                  const dtContbPg = pg.data_contabilizacao || ''\r\n" +
"                                  const dtPgtoPg = pg.dt_pagamento || ''\r\n" +
"                                  const partsCPg = dtContbPg.includes('-') ? dtContbPg.split('-').reverse() : dtContbPg.split('/')\r\n" +
"                                  const mmCPg = parseInt(partsCPg[1]); const aaCPg = parseInt(partsCPg[2])\r\n" +
"                                  const partsPPg = dtPgtoPg.includes('-') ? dtPgtoPg.split('-').reverse() : dtPgtoPg.split('/')\r\n" +
"                                  const mmPPg = parseInt(partsPPg[1]); const aaPPg = parseInt(partsPPg[2])\r\n" +
"                                  const now2Pg = new Date(); const mesContPg = now2Pg.getMonth() + 1; const anoContPg = now2Pg.getFullYear()\r\n" +
"                                  const condMesAntPg = !!(dtContbPg && mmCPg === mesAntIdx + 1 && aaCPg === anoAnt)\r\n" +
"                                  const condMesAtualPg = dtContbPg ? (mmCPg === mesContPg && aaCPg === anoContPg) : (mmPPg === mesContPg && aaPPg === anoContPg)\r\n" +
"                                  if ((condMesAntPg || condMesAtualPg) && pg.valor_pago > 0) {\r\n" +
"                                    return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>\r\n" +
"                                  }";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK bloco parcial");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - regra da coluna Imposto atualizada"); }
else console.log("Corrigir ancoras antes de continuar");
