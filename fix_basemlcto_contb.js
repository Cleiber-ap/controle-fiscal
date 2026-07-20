const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const calcBaseMLcto = (pgtos: Record<string, any[]>, notas: any[]) => {\r\n" +
"    let base = 0\r\n" +
"    // Pagamentos parciais: filtrar por dt_pagamento no mes anterior\r\n" +
"    Object.values(pgtos).forEach((lista: any[]) => {\r\n" +
"      lista.forEach((p: any) => {\r\n" +
"        if (dtNoMesAntCalc(p.dt_pagamento)) {\r\n" +
"          base += parseFloat(p.valor_pago) || 0\r\n" +
"        }\r\n" +
"      })\r\n" +
"    })\r\n" +
"    // Pagamentos integrais (sem historico em pagamentos_nf): filtrar por dt_pagamento\r\n" +
"    notas.forEach((n: any) => {\r\n" +
"      const temHistorico = pgtos[n.numero_nf] && pgtos[n.numero_nf].length > 0\r\n" +
"      if (!temHistorico) {\r\n" +
"        const dtPag = n.dt_pagamento || n.data_pagamento\r\n" +
"        if (dtNoMesAntCalc(dtPag)) base += parseFloat(n.valor_pago) || 0\r\n" +
"      }\r\n" +
"    })\r\n" +
"    return base\r\n" +
"  }";

const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const calcBaseMLcto = (pgtos: Record<string, any[]>, notas: any[]) => {\r\n" +
"    let base = 0\r\n" +
"    // Pagamentos parciais: filtrar por data_contabilizacao no mes anterior\r\n" +
"    Object.values(pgtos).forEach((lista: any[]) => {\r\n" +
"      lista.forEach((p: any) => {\r\n" +
"        if (dtNoMesAntCalc(p.data_contabilizacao)) {\r\n" +
"          base += parseFloat(p.valor_pago) || 0\r\n" +
"        }\r\n" +
"      })\r\n" +
"    })\r\n" +
"    // Pagamentos integrais (sem historico em pagamentos_nf): filtrar por data_contabilizacao\r\n" +
"    notas.forEach((n: any) => {\r\n" +
"      const temHistorico = pgtos[n.numero_nf] && pgtos[n.numero_nf].length > 0\r\n" +
"      if (!temHistorico) {\r\n" +
"        const dtContb = n.data_contabilizacao\r\n" +
"        if (dtNoMesAntCalc(dtContb)) base += parseFloat(n.valor_pago) || 0\r\n" +
"      }\r\n" +
"    })\r\n" +
"    return base\r\n" +
"  }";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - calcBaseMLcto agora usa data_contabilizacao");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
