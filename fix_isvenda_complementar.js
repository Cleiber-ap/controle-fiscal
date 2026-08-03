const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const isVendaOuParcial = (r: any) => {\r\n" +
"      const st = (r.nat_operacao || r.status || '').toLowerCase()\r\n" +
"      return (st.includes('venda') && !st.includes('devolu')) || st.includes('complemento de frete')\r\n" +
"    }";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const isVendaOuParcial = (r: any) => {\r\n" +
"      const st = (r.nat_operacao || r.status || '').toLowerCase()\r\n" +
"      return (st.includes('venda') && !st.includes('devolu')) || st.includes('complemento de frete') || st.includes('complementar')\r\n" +
"    }";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - NF-e Complementar incluida no calculo de faturamento");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
