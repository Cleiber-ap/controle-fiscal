const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = `<td style={tdBase({ textAlign: 'right', color: '#7B82A0', ...mono, fontSize: '11px' })}>{pg.dt_pagamento || '\u2014'}</td>`;
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novoTd = `
                              <td style={tdBase({ textAlign: "right", ...mono, fontSize: "11px" })}>
                                {editandoContb === (r.numero_nf + "-" + pg.id) ? (
                                  <input type="text" autoFocus value={editContbVal}
                                    onChange={e => setEditContbVal(e.target.value)}
                                    onBlur={async () => {
                                      let val = editContbVal.trim()
                                      if (/^\\d{1,2}\\/\\d{1,2}$/.test(val)) {
                                        const [d, m] = val.split("/")
                                        val = d.padStart(2,"0") + "/" + m.padStart(2,"0") + "/" + new Date().getFullYear()
                                      }
                                      setEditContbVal(val)
                                      setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, data_contabilizacao: val} : n))
                                      await api.put("/notas/contabilizacao/" + r.id, { data_contabilizacao: val })
                                      setEditandoContb(null)
                                    }}
                                    onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur() }}
                                    placeholder="dd/mm/aaaa"
                                    style={{ width: "72px", background: "#1A1D2A", border: "1px solid #4A5070", borderRadius: "3px", color: "#E4E7F0", fontSize: "11px", padding: "2px 4px", textAlign: "right" }} />
                                ) : (
                                  <span onClick={() => { setEditandoContb(r.numero_nf + "-" + pg.id); setEditContbVal(r.data_contabilizacao || "") }}
                                    style={{ cursor: "pointer", color: r.data_contabilizacao ? "#7B82A0" : "#4A5070" }}>
                                    {r.data_contabilizacao || "\u2014"}
                                  </span>
                                )}
                              </td>`;
  c = c.replace(anchor, anchor + novoTd);
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("OK - DT.CONTB adicionado nas linhas parciais"); }
else console.log("Corrigir ancora antes de continuar");
