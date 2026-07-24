const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Disparar pulso quando ajuste automatico ORIGINAL for aplicado
const anchor1 = "const dtPgtoRef1 = temHistorico ? (lista[0]?.dt_pagamento || \"\") : (r.dt_pagamento || r.data_pagamento || \"\")\n                                    if (val && dtPgtoRef1 && val !== dtPgtoRef1 && !r.ajustado) {\n                                      setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: true} : n))\n                                      setAjustadosPg(prev => { const upd = {...prev}; lista.forEach((p) => { upd[p.id] = true }); return upd })\n                                      await api.put(\"/notas/ajustado/\" + r.id, { ajustado: true })\n                                    }";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = "const dtPgtoRef1 = temHistorico ? (lista[0]?.dt_pagamento || \"\") : (r.dt_pagamento || r.data_pagamento || \"\")\n                                    if (val && dtPgtoRef1 && val !== dtPgtoRef1 && !r.ajustado) {\n                                      setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: true} : n))\n                                      setAjustadosPg(prev => { const upd = {...prev}; lista.forEach((p) => { upd[p.id] = true }); return upd })\n                                      await api.put(\"/notas/ajustado/\" + r.id, { ajustado: true })\n                                      setPulsando(prev => new Set([...prev, \"ajuste-\" + r.id]))\n                                      setTimeout(() => setPulsando(prev => { const n = new Set(prev); n.delete(\"ajuste-\" + r.id); return n }), 900)\n                                    }";
  c = c.slice(0, idx1) + novo1 + c.slice(idx1 + anchor1.length);
  console.log("OK: pulso disparado na regra automatica ORIGINAL");
}

// 2. Disparar pulso na regra automatica PARCIAL
const anchor2 = "if (val && pg.dt_pagamento && val !== pg.dt_pagamento && !r.ajustado) {\n                                        setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: true} : n))\n                                        setAjustadosPg(prev => { const upd = {...prev}; lista.forEach((p) => { upd[p.id] = true }); return upd })\n                                        await api.put(\"/notas/ajustado/\" + r.id, { ajustado: true })\n                                      }";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "if (val && pg.dt_pagamento && val !== pg.dt_pagamento && !r.ajustado) {\n                                        setNotas(prev => prev.map(n => n.numero_nf === r.numero_nf ? {...n, ajustado: true} : n))\n                                        setAjustadosPg(prev => { const upd = {...prev}; lista.forEach((p) => { upd[p.id] = true }); return upd })\n                                        await api.put(\"/notas/ajustado/\" + r.id, { ajustado: true })\n                                        setPulsando(prev => new Set([...prev, \"ajuste-\" + r.id]))\n                                        setTimeout(() => setPulsando(prev => { const n = new Set(prev); n.delete(\"ajuste-\" + r.id); return n }), 900)\n                                      }";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: pulso disparado na regra automatica PARCIAL");
}

// 3. Aplicar estilo de pulso no botao Ajuste (linha original)
const anchor3 = "style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #4A5070', background: r.ajustado ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\r\n                            {r.ajustado && <span style={{ color: '#0D0F17', fontSize: 10, fontWeight: 700, lineHeight";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  const novo3 = "style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #4A5070', background: r.ajustado ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: pulsando.has('ajuste-' + r.id) ? '0 0 0 4px rgba(52,211,153,0.45)' : 'none', transition: 'box-shadow 0.4s' }}>\r\n                            {r.ajustado && <span style={{ color: '#0D0F17', fontSize: 10, fontWeight: 700, lineHeight";
  c = c.slice(0, idx3) + novo3 + c.slice(idx3 + anchor3.length);
  console.log("OK: estilo de pulso aplicado no botao ORIGINAL");
}

// 4. Aplicar estilo de pulso no botao Ajuste (linha parcial)
const anchor4 = "style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #4A5070', background: ajustadosPg[pg.id] ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ajustadosPg[pg.id] && <span style={{ color: '#0D0F17', fontSize: 10, fontWeight: 700 }}>✓</span>}</button>}</td>";
const idx4 = c.indexOf(anchor4);
if (idx4 === -1) { console.log("FALHOU: anchor4"); ok = false; }
else {
  const novo4 = "style={{ width: 14, height: 14, borderRadius: 3, border: '1px solid #4A5070', background: ajustadosPg[pg.id] ? '#34D399' : '#2A2D3E', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: pulsando.has('ajuste-' + r.id) ? '0 0 0 4px rgba(52,211,153,0.45)' : 'none', transition: 'box-shadow 0.4s' }}>{ajustadosPg[pg.id] && <span style={{ color: '#0D0F17', fontSize: 10, fontWeight: 700 }}>✓</span>}</button>}</td>";
  c = c.slice(0, idx4) + novo4 + c.slice(idx4 + anchor4.length);
  console.log("OK: estilo de pulso aplicado no botao PARCIAL");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - pulso no Ajuste automatico implementado"); }
else console.log("Corrigir ancoras antes de continuar");
