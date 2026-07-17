const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// BLOCO 1 - linha original (temHistorico e sem historico)
const anchor1 = `setEditContbVal(val)
                                    if (temHistorico) {
                                      setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === lista[0].id ? {...p, data_contabilizacao: val} : p)}))
                                      await api.put("/notas/pagamento/contabilizacao/" + lista[0].id, { data_contabilizacao: val })
                                    } else {
                                      setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: val} : n))
                                      await api.put("/notas/contabilizacao/" + r.id, { data_contabilizacao: val })
                                    }`;
if (c.indexOf(anchor1) === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = `setEditContbVal(val)
                                    if (temHistorico) {
                                      setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === lista[0].id ? {...p, data_contabilizacao: val} : p)}))
                                      await api.put("/notas/pagamento/contabilizacao/" + lista[0].id, { data_contabilizacao: val })
                                    } else {
                                      setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: val} : n))
                                      await api.put("/notas/contabilizacao/" + r.id, { data_contabilizacao: val })
                                    }
                                    const dtPgtoRef1 = temHistorico ? (lista[0]?.dt_pagamento || "") : (r.dt_pagamento || r.data_pagamento || "")
                                    if (val && dtPgtoRef1 && val !== dtPgtoRef1 && !r.ajustado) {
                                      setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: true} : n))
                                      setAjustadosPg(prev => { const upd = {...prev}; lista.forEach((p) => { upd[p.id] = true }); return upd })
                                      await api.put("/notas/ajustado/" + r.id, { ajustado: true })
                                    }`;
  c = c.replace(anchor1, novo1);
}

// BLOCO 2 - linha parcial
const anchor2 = `setEditContbVal(val)
                                      setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === pg.id ? {...p, data_contabilizacao: val} : p)}))
                                      await api.put("/notas/pagamento/contabilizacao/" + pg.id, { data_contabilizacao: val })`;
if (c.indexOf(anchor2) === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = `setEditContbVal(val)
                                      setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === pg.id ? {...p, data_contabilizacao: val} : p)}))
                                      await api.put("/notas/pagamento/contabilizacao/" + pg.id, { data_contabilizacao: val })
                                      if (val && pg.dt_pagamento && val !== pg.dt_pagamento && !r.ajustado) {
                                        setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: true} : n))
                                        setAjustadosPg(prev => { const upd = {...prev}; lista.forEach((p) => { upd[p.id] = true }); return upd })
                                        await api.put("/notas/ajustado/" + r.id, { ajustado: true })
                                      }`;
  c = c.replace(anchor2, novo2);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - ajuste automatico implementado"); }
else console.log("Corrigir ancoras antes de continuar");
