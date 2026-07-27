const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "<td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}></td>\n                            <td style={tdSm({ textAlign: 'center' })}></td>";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "<td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}></td>\n" +
"                            <td style={tdSm({ textAlign: 'right', color: '#4A5070', fontSize: '11px' })}></td>\n" +
"                            <td style={tdSm({ textAlign: 'center' })}></td>";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - celula da coluna Imposto adicionada na linha vazia (Aguardando)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
