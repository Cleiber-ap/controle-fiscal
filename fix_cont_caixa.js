const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");

// L175: filtro dos parciais para regime de caixa - trocar mes_lancamento por dt_pagamento
c = c.replace(
  "const soma = lista.filter((p: any) => p.mes_lancamento && p.mes_lancamento.toLowerCase() === mesAtualStrCtb).reduce((a: number, p: any) => a + (parseFloat(p.valor_pago) || 0), 0)",
  "const soma = lista.filter((p: any) => { const dt = p.dt_pagamento||''; const parts = dt.includes('-')?dt.split('-').reverse():dt.split('/'); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[2])===anoAnt }).reduce((a: number, p: any) => a + (parseFloat(p.valor_pago) || 0), 0)"
);

// L178: filtro dos integrais para regime de caixa - trocar mes_lancamento por dt_pagamento
c = c.replace(
  "if (r.mes_lancamento && r.mes_lancamento.toLowerCase() === mesAtualStrCtb) return s + (parseFloat(r.valor_pago) || 0)",
  "const dtP = r.dt_pagamento||r.data_pagamento||''; const partsP = dtP.includes('-')?dtP.split('-').reverse():dtP.split('/'); if(parseInt(partsP[1])===mesAntIdx+1&&parseInt(partsP[2])===anoAnt) return s + (parseFloat(r.valor_pago) || 0)"
);

// Remover a variavel mesAtualStrCtb que nao e mais necessaria
c = c.replace(
  "  const mesAtualStrCtb = MESES[mesAntIdx].toLowerCase() + '/' + anoAnt\n",
  ""
);

fs.writeFileSync(f, c, "utf8");
const ok = !c.includes("mesAtualStrCtb") && c.includes("parseInt(parts[1])===mesAntIdx+1");
console.log(ok ? "OK" : "FALHOU");
