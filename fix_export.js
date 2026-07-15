const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', 'utf8');

// Substituir o filtro notasPagas para incluir mês atual também
const oldFilter = `      const notasPagas = listaFiltrada.filter((n:any)=>{
        const pgtos=pagamentos[n.numero_nf]||[]
        if(pgtos.length===0){
          const dtP=n.dt_pagamento||n.data_pagamento; if(!dtP) return false
          const parts=dtP.includes("-")?dtP.split("-"):dtP.split("/").reverse()
          return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt
        }
        return pgtos.some((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt })
      })`;

const newFilter = `      const mesAtualIdx2 = now.getMonth()
      const anoAtual2 = now.getFullYear()
      const notasPagas = listaFiltrada.filter((n:any)=>{
        const pgtos=pagamentos[n.numero_nf]||[]
        const isPagoMesRef = (mes: number, ano: number) =>
          (mes===mesAntIdx+1&&ano===anoAnt) || (mes===mesAtualIdx2+1&&ano===anoAtual2)
        if(pgtos.length===0){
          const dtP=n.dt_pagamento||n.data_pagamento; if(!dtP) return false
          const parts=dtP.includes("-")?dtP.split("-"):dtP.split("/").reverse()
          return isPagoMesRef(parseInt(parts[1]), parseInt(parts[0]))
        }
        return pgtos.some((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); return isPagoMesRef(parseInt(parts[1]), parseInt(parts[0])) })
      })`;

if (!c.includes(oldFilter)) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(oldFilter, newFilter);

// Também ajustar o cálculo de pgtosMes para incluir mês atual
const oldPgtosMes = `        const pgtosMes = pgtos.filter((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); return parseInt(parts[1])===mesAntIdx+1&&parseInt(parts[0])===anoAnt })`;
const newPgtosMes = `        const pgtosMes = pgtos.filter((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); const m=parseInt(parts[1]); const a=parseInt(parts[0]); return (m===mesAntIdx+1&&a===anoAnt)||(m===mesAtualIdx2+1&&a===anoAtual2) })`;

if (!c.includes(oldPgtosMes)) { console.log('NAO ENCONTRADO: pgtosMes'); process.exit(1); }
c = c.replace(oldPgtosMes, newPgtosMes);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', c, 'utf8');
console.log('OK');
