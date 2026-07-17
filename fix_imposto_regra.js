const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// BLOCO 1 - linha original
const anchor1 = `const dtPg = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')
                            const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')
                            const mm = parseInt(parts[1])
                            const aa = parseInt(parts[2])
                            const now2 = new Date(); const mesCont = now2.getMonth() + 1; const anoCont = now2.getFullYear(); if (((mm === mesAntIdx + 1 && aa === anoAnt) || (mm === mesCont && aa === anoCont)) && primeiroPagamento > 0) {
                              return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>
                            }`;
if (c.indexOf(anchor1) === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = `const dtContb = temHistorico ? (lista[0]?.data_contabilizacao || '') : (r.data_contabilizacao || '')
                            const dtPgto = temHistorico ? (lista[0]?.dt_pagamento || '') : (r.dt_pagamento || r.data_pagamento || '')
                            const partsC = dtContb.includes('-') ? dtContb.split('-').reverse() : dtContb.split('/')
                            const mmC = parseInt(partsC[1]); const aaC = parseInt(partsC[2])
                            const partsP = dtPgto.includes('-') ? dtPgto.split('-').reverse() : dtPgto.split('/')
                            const mmP = parseInt(partsP[1]); const aaP = parseInt(partsP[2])
                            const now2 = new Date(); const mesCont = now2.getMonth() + 1; const anoCont = now2.getFullYear()
                            const condMesAnt = !!(dtContb && mmC === mesAntIdx + 1 && aaC === anoAnt)
                            const condMesAtual = dtContb ? (mmC === mesCont && aaC === anoCont) : (mmP === mesCont && aaP === anoCont)
                            if ((condMesAnt || condMesAtual) && primeiroPagamento > 0) {
                              return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>
                            }`;
  c = c.replace(anchor1, novo1);
}

// BLOCO 2 - linha parcial
const anchor2 = `const dtPg = pg.dt_pagamento || ''
                                  const parts = dtPg.includes('-') ? dtPg.split('-').reverse() : dtPg.split('/')
                                  const mm = parseInt(parts[1])
                                  const aa = parseInt(parts[2])
                                  if (mm === mesAntIdx + 1 && aa === anoAnt && pg.valor_pago > 0) {
                                    return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>
                                  }`;
if (c.indexOf(anchor2) === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = `const dtContbPg = pg.data_contabilizacao || ''
                                  const dtPgtoPg = pg.dt_pagamento || ''
                                  const partsCPg = dtContbPg.includes('-') ? dtContbPg.split('-').reverse() : dtContbPg.split('/')
                                  const mmCPg = parseInt(partsCPg[1]); const aaCPg = parseInt(partsCPg[2])
                                  const partsPPg = dtPgtoPg.includes('-') ? dtPgtoPg.split('-').reverse() : dtPgtoPg.split('/')
                                  const mmPPg = parseInt(partsPPg[1]); const aaPPg = parseInt(partsPPg[2])
                                  const now2Pg = new Date(); const mesContPg = now2Pg.getMonth() + 1; const anoContPg = now2Pg.getFullYear()
                                  const condMesAntPg = !!(dtContbPg && mmCPg === mesAntIdx + 1 && aaCPg === anoAnt)
                                  const condMesAtualPg = dtContbPg ? (mmCPg === mesContPg && aaCPg === anoContPg) : (mmPPg === mesContPg && aaPPg === anoContPg)
                                  if ((condMesAntPg || condMesAtualPg) && pg.valor_pago > 0) {
                                    return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>
                                  }`;
  c = c.replace(anchor2, novo2);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - regra da coluna Imposto atualizada"); }
else console.log("Corrigir ancoras antes de continuar");
