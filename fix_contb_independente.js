const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

function replaceTdBlock(marker, buildNewBlock, label) {
  const startMarkerIdx = c.indexOf(marker);
  if (startMarkerIdx === -1) { console.log("FALHOU: " + label); ok = false; return; }
  const tdOpenIdx = c.lastIndexOf("<td", startMarkerIdx);
  const tdCloseIdx = c.indexOf("</td>", startMarkerIdx) + "</td>".length;
  const newBlock = buildNewBlock();
  c = c.slice(0, tdOpenIdx) + newBlock + c.slice(tdCloseIdx);
  console.log("OK bloco: " + label);
}

replaceTdBlock("{editandoContb === r.numero_nf ? (", () => `<td style={tdBase({ textAlign: "right", ...mono, fontSize: "11px" })}>
                            {(() => {
                              const contbId = temHistorico ? ("pgto-" + lista[0].id) : ("nota-" + r.id)
                              const contbAtual = temHistorico ? (lista[0].data_contabilizacao || "") : (r.data_contabilizacao || "")
                              return editandoContb === contbId ? (
                                <input type="text" autoFocus value={editContbVal}
                                  onChange={e => setEditContbVal(e.target.value)}
                                  onBlur={async () => {
                                    let val = editContbVal.trim()
                                    if (/^\\d{1,2}\\/\\d{1,2}$/.test(val)) {
                                      const [d, m] = val.split("/")
                                      val = d.padStart(2,"0") + "/" + m.padStart(2,"0") + "/" + new Date().getFullYear()
                                    }
                                    setEditContbVal(val)
                                    if (temHistorico) {
                                      setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === lista[0].id ? {...p, data_contabilizacao: val} : p)}))
                                      await api.put("/notas/pagamento/contabilizacao/" + lista[0].id, { data_contabilizacao: val })
                                    } else {
                                      setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: val} : n))
                                      await api.put("/notas/contabilizacao/" + r.id, { data_contabilizacao: val })
                                    }
                                    setEditandoContb(null)
                                  }}
                                  onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
                                  placeholder="dd/mm/aaaa"
                                  style={{ width: "72px", background: "#1A1D2A", border: "1px solid #4A5070", borderRadius: "3px", color: "#E4E7F0", fontSize: "11px", padding: "2px 4px", textAlign: "right" }} />
                              ) : (
                                <span onClick={() => { setEditandoContb(contbId); setEditContbVal(contbAtual) }}
                                  style={{ cursor: "pointer", color: contbAtual ? "#7B82A0" : "#4A5070" }}>
                                  {contbAtual || "\u2014"}
                                </span>
                              )
                            })()}
                          </td>`, "linha original");

replaceTdBlock('{editandoContb === (r.numero_nf + "-" + pg.id) ? (', () => `<td style={tdBase({ textAlign: "right", ...mono, fontSize: "11px" })}>
                                {editandoContb === ("pgto-" + pg.id) ? (
                                  <input type="text" autoFocus value={editContbVal}
                                    onChange={e => setEditContbVal(e.target.value)}
                                    onBlur={async () => {
                                      let val = editContbVal.trim()
                                      if (/^\\d{1,2}\\/\\d{1,2}$/.test(val)) {
                                        const [d, m] = val.split("/")
                                        val = d.padStart(2,"0") + "/" + m.padStart(2,"0") + "/" + new Date().getFullYear()
                                      }
                                      setEditContbVal(val)
                                      setPagamentos(prev => ({...prev, [r.numero_nf]: (prev[r.numero_nf]||[]).map((p) => p.id === pg.id ? {...p, data_contabilizacao: val} : p)}))
                                      await api.put("/notas/pagamento/contabilizacao/" + pg.id, { data_contabilizacao: val })
                                      setEditandoContb(null)
                                    }}
                                    onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
                                    placeholder="dd/mm/aaaa"
                                    style={{ width: "72px", background: "#1A1D2A", border: "1px solid #4A5070", borderRadius: "3px", color: "#E4E7F0", fontSize: "11px", padding: "2px 4px", textAlign: "right" }} />
                                ) : (
                                  <span onClick={() => { setEditandoContb("pgto-" + pg.id); setEditContbVal(pg.data_contabilizacao || "") }}
                                    style={{ cursor: "pointer", color: pg.data_contabilizacao ? "#7B82A0" : "#4A5070" }}>
                                    {pg.data_contabilizacao || "\u2014"}
                                  </span>
                                )}
                              </td>`, "linha parcial");

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - DT.CONTB agora independente por pagamento"); }
else console.log("Corrigir marcadores antes de continuar");
