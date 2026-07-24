const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Novo state "voando" (junto com pulsando)
const anchor1 = "const [pulsando, setPulsando] = useState<Set<string>>(new Set())";
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  c = c.slice(0, idx1) + anchor1 + "\r\n  const [voando, setVoando] = useState<Set<string>>(new Set())" + c.slice(idx1 + anchor1.length);
  console.log("OK: state voando adicionado");
}

// 2. Disparar voo no botao copiar ORIGINAL
const anchor2 = "await api.put(\"/notas/contabilizacao/\" + r.id, { data_contabilizacao: dtCopy })\n                                      }\n                                    }}\n                                    style={{ marginLeft: \"4px\", padding: \"1px 4px\", background: \"#1A1D2A\", border: \"1px solid #4A5070\", borderRadius: \"3px\", color: \"#7B82A0\", fontSize: \"10px\", cursor: \"pointer\" }}>↳</button> : null";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "await api.put(\"/notas/contabilizacao/\" + r.id, { data_contabilizacao: dtCopy })\n                                      }\n                                      const idVoo = temHistorico ? (\"pgto-\" + lista[0].id) : (\"nota-\" + r.id)\n                                      setVoando(prev => new Set([...prev, idVoo]))\n                                      setTimeout(() => setVoando(prev => { const n = new Set(prev); n.delete(idVoo); return n }), 500)\n                                    }}\n                                    style={{ marginLeft: \"4px\", padding: \"1px 4px\", background: \"#1A1D2A\", border: \"1px solid #4A5070\", borderRadius: \"3px\", color: \"#7B82A0\", fontSize: \"10px\", cursor: \"pointer\" }}>↳</button> : null";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: voo disparado no botao ORIGINAL");
}

// 3. Disparar voo no botao copiar PARCIAL
const anchor3 = "await api.put(\"/notas/pagamento/contabilizacao/\" + pg.id, { data_contabilizacao: pg.dt_pagamento })\n                                    }}\n                                    style={{ marginLeft: \"4px\", paddin";
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  const novo3 = "await api.put(\"/notas/pagamento/contabilizacao/\" + pg.id, { data_contabilizacao: pg.dt_pagamento })\n                                      setVoando(prev => new Set([...prev, \"pgto-\" + pg.id]))\n                                      setTimeout(() => setVoando(prev => { const n = new Set(prev); n.delete(\"pgto-\" + pg.id); return n }), 500)\n                                    }}\n                                    style={{ marginLeft: \"4px\", paddin";
  c = c.slice(0, idx3) + novo3 + c.slice(idx3 + anchor3.length);
  console.log("OK: voo disparado no botao PARCIAL");
}

// 4. Estilo de voo no span ORIGINAL
const anchor4 = "style={{ cursor: \"pointer\", transition: \"background-color 0.4s\", backgroundColor: pulsando.has(contbId) ? \"rgba(52,211,153,0.35)\" : \"transparent\", borderRadius: \"4px\", padding: \"1px 4px\", color: contbAtual ? \"#7B82A0\" : \"#4A5070\" }}>\n                                  {contbAtual || \"—\"}";
const idx4 = c.indexOf(anchor4);
if (idx4 === -1) { console.log("FALHOU: anchor4"); ok = false; }
else {
  const novo4 = "style={{ cursor: \"pointer\", transition: \"background-color 0.4s, transform 0.4s, opacity 0.4s\", backgroundColor: pulsando.has(contbId) ? \"rgba(52,211,153,0.35)\" : \"transparent\", borderRadius: \"4px\", padding: \"1px 4px\", color: contbAtual ? \"#7B82A0\" : \"#4A5070\", display: \"inline-block\", transform: voando.has(contbId) ? \"translateX(0)\" : \"none\", opacity: voando.has(contbId) ? 1 : 1, animation: voando.has(contbId) ? \"voarEntrada 0.5s ease\" : \"none\" }}>\n                                  {contbAtual || \"—\"}";
  c = c.slice(0, idx4) + novo4 + c.slice(idx4 + anchor4.length);
  console.log("OK: estilo de voo aplicado no span ORIGINAL");
}

// 5. Estilo de voo no span PARCIAL
const anchor5 = "style={{ cursor: \"pointer\", transition: \"background-color 0.4s\", backgroundColor: pulsando.has(\"pgto-\" + pg.id) ? \"rgba(52,211,153,0.35)\" : \"transparent\", borderRadius: \"4px\", padding: \"1px 4px\", color: pg.data_contabilizacao ? \"#7B82A0\" : \"#4A5070\" }}>\n                                    {pg.data_contabilizacao || \"—\"}";
const idx5 = c.indexOf(anchor5);
if (idx5 === -1) { console.log("FALHOU: anchor5"); ok = false; }
else {
  const novo5 = "style={{ cursor: \"pointer\", transition: \"background-color 0.4s\", backgroundColor: pulsando.has(\"pgto-\" + pg.id) ? \"rgba(52,211,153,0.35)\" : \"transparent\", borderRadius: \"4px\", padding: \"1px 4px\", color: pg.data_contabilizacao ? \"#7B82A0\" : \"#4A5070\", display: \"inline-block\", animation: voando.has(\"pgto-\" + pg.id) ? \"voarEntrada 0.5s ease\" : \"none\" }}>\n                                    {pg.data_contabilizacao || \"—\"}";
  c = c.slice(0, idx5) + novo5 + c.slice(idx5 + anchor5.length);
  console.log("OK: estilo de voo aplicado no span PARCIAL");
}

// 6. Definir o keyframe voarEntrada (uma vez, junto com o skeleton pulse)
const anchor6 = "@keyframes skeletonPulse { 0%, 100% { opacity: 0.35 } 50% { opacity: 0.8 } }";
const idx6 = c.indexOf(anchor6);
if (idx6 === -1) { console.log("FALHOU: anchor6"); ok = false; }
else {
  c = c.replace(anchor6, anchor6 + " @keyframes voarEntrada { from { transform: translateX(-10px); opacity: 0.3 } to { transform: translateX(0); opacity: 1 } }");
  console.log("OK: keyframe voarEntrada adicionado");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - efeito de voo no botao copiar implementado"); }
else console.log("Corrigir ancoras antes de continuar");
