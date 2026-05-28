const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx";
let c = fs.readFileSync(f, "utf8");

const OLD = `  const calcBaseMLcto = (pgtos: Record<string, any[]>, notas: any[]) => {
    let base = 0
    // Pagamentos parciais com mes_lancamento
    Object.values(pgtos).forEach((lista: any[]) => {
      lista.forEach((p: any) => {
        if (p.mes_lancamento && p.mes_lancamento.toLowerCase() === mesAtualStr) {
          base += parseFloat(p.valor_pago) || 0
        }
      })
    })
    // Pagamentos integrais (sem historico em pagamentos_nf)
    notas.forEach((n: any) => {
      if (n.mes_lancamento && n.mes_lancamento.toLowerCase() === mesAtualStr) {
        const temHistorico = pgtos[n.numero_nf] && pgtos[n.numero_nf].length > 0
        if (!temHistorico) base += parseFloat(n.valor_pago) || 0
      }
    })
    return base
  }`;

const NEW = `  const dtNoMesAntCalc = (dtStr: string | undefined) => {
    if (!dtStr) return false
    const parts = dtStr.includes('-') ? dtStr.split('-').reverse() : dtStr.split('/')
    return parseInt(parts[1]) === mesAntIdx + 1 && parseInt(parts[2]) === anoAnt
  }

  const calcBaseMLcto = (pgtos: Record<string, any[]>, notas: any[]) => {
    let base = 0
    // Pagamentos parciais: filtrar por dt_pagamento no mes anterior
    Object.values(pgtos).forEach((lista: any[]) => {
      lista.forEach((p: any) => {
        if (dtNoMesAntCalc(p.dt_pagamento)) {
          base += parseFloat(p.valor_pago) || 0
        }
      })
    })
    // Pagamentos integrais (sem historico em pagamentos_nf): filtrar por dt_pagamento
    notas.forEach((n: any) => {
      const temHistorico = pgtos[n.numero_nf] && pgtos[n.numero_nf].length > 0
      if (!temHistorico) {
        const dtPag = n.dt_pagamento || n.data_pagamento
        if (dtNoMesAntCalc(dtPag)) base += parseFloat(n.valor_pago) || 0
      }
    })
    return base
  }`;

c = c.replace(OLD, NEW);
fs.writeFileSync(f, c, "utf8");
console.log(c.includes("dtNoMesAntCalc") ? "OK" : "FALHOU");
