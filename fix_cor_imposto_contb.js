const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Linha original
const a1 = "primeiroPagamento > 0) {\r\n                              return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>\r\n                            }";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 original"); ok = false; }
else {
  const n1 = "primeiroPagamento > 0) {\r\n                              return <span style={{ color: dtContb ? '#4F8EF7' : '#FBBF24', fontWeight: 600 }}>{fmtR(primeiroPagamento * aliqEfetivaCont)}</span>\r\n                            }";
  c = c.replace(a1, n1);
  console.log("OK 1: linha original com cor condicional");
}

// 2. Linha parcial
const a2 = "pg.valor_pago > 0) {\r\n                                    return <span style={{ color: '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 parcial"); ok = false; }
else {
  const n2 = "pg.valor_pago > 0) {\r\n                                    return <span style={{ color: dtContbPg ? '#4F8EF7' : '#FBBF24', fontWeight: 600 }}>{fmtR(parseFloat(pg.valor_pago) * aliqEfetivaCont)}</span>";
  c = c.replace(a2, n2);
  console.log("OK 2: linha parcial com cor condicional");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
