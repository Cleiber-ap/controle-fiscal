const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// BLOCO 1 - linha original
const anchor1 = `<span onClick={() => { setEditandoContb(contbId); setEditContbVal(contbAtual) }}
                                  style={{ cursor: "pointer", color: contbAtual ? "#7B82A0" : "#4A5070" }}>
                                  {contbAtual || "\u2014"}
                                </span>`;
if (c.indexOf(anchor1) === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = `<>
                                <span onClick={() => { setEditandoContb(contbId); setEditContbVal(contbAtual) }}
                                  style={{ cursor: "pointer", color: contbAtual ? "#7B82A0" : "#4A5070" }}>
                                  {contbAtual || "\u2014"}
                                </span>
                                {!contbAtual && (() => {
                                  const dtCopy = temHistorico ? (lista[0]?.dt_pagamento || "") : (r.dt_pagamento || r.data_pagamento || "")
                                  return dtCopy ? <button
                                    title={"Copiar data de pagamento: " + dtCopy}
                                    onClick={async (e) => {
                                      e.stopPropagation()
                                      if (temHistorico) {
                                        setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === lista[0].id ? {...p, data_contabilizacao: dtCopy} : p)}))
                                        await api.put("/notas/pagamento/contabilizacao/" + lista[0].id, { data_contabilizacao: dtCopy })
                                      } else {
                                        setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: dtCopy} : n))
                                        await api.put("/notas/contabilizacao/" + r.id, { data_contabilizacao: dtCopy })
                                      }
                                    }}
                                    style={{ marginLeft: "4px", padding: "1px 4px", background: "#1A1D2A", border: "1px solid #4A5070", borderRadius: "3px", color: "#7B82A0", fontSize: "10px", cursor: "pointer" }}>\u21B3</button> : null
                                })()}
                              </>`;
  c = c.replace(anchor1, novo1);
}

// BLOCO 2 - linha parcial
const anchor2 = `<span onClick={() => { setEditandoContb("pgto-" + pg.id); setEditContbVal(pg.data_contabilizacao || "") }}
                                    style={{ cursor: "pointer", color: pg.data_contabilizacao ? "#7B82A0" : "#4A5070" }}>
                                    {pg.data_contabilizacao || "\u2014"}
                                  </span>`;
if (c.indexOf(anchor2) === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = `<>
                                  <span onClick={() => { setEditandoContb("pgto-" + pg.id); setEditContbVal(pg.data_contabilizacao || "") }}
                                    style={{ cursor: "pointer", color: pg.data_contabilizacao ? "#7B82A0" : "#4A5070" }}>
                                    {pg.data_contabilizacao || "\u2014"}
                                  </span>
                                  {!pg.data_contabilizacao && pg.dt_pagamento ? <button
                                    title={"Copiar data de pagamento: " + pg.dt_pagamento}
                                    onClick={async (e) => {
                                      e.stopPropagation()
                                      setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === pg.id ? {...p, data_contabilizacao: pg.dt_pagamento} : p)}))
                                      await api.put("/notas/pagamento/contabilizacao/" + pg.id, { data_contabilizacao: pg.dt_pagamento })
                                    }}
                                    style={{ marginLeft: "4px", padding: "1px 4px", background: "#1A1D2A", border: "1px solid #4A5070", borderRadius: "3px", color: "#7B82A0", fontSize: "10px", cursor: "pointer" }}>\u21B3</button> : null}
                                </>`;
  c = c.replace(anchor2, novo2);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - botao de copiar data adicionado"); }
else console.log("Corrigir ancoras antes de continuar");
