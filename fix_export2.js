const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', 'utf8');

// Usar indexOf para localizar e substituir o bloco notasPagas
const idxStart = c.indexOf('const notasPagas = listaFiltrada.filter');
if (idxStart === -1) { console.log('NAO ENCONTRADO: notasPagas'); process.exit(1); }

const idxEnd = c.indexOf('\n      })', idxStart) + '\n      })'.length;

const newFilter = `const mesAtualIdx2 = now.getMonth()
      const anoAtual2 = now.getFullYear()
      const notasPagas = listaFiltrada.filter((n:any)=>{
        const pgtos=pagamentos[n.numero_nf]||[]
        const isPagoRef = (mes: number, ano: number) =>
          (mes===mesAntIdx+1&&ano===anoAnt) || (mes===mesAtualIdx2+1&&ano===anoAtual2)
        if(pgtos.length===0){
          const dtP=n.dt_pagamento||n.data_pagamento; if(!dtP) return false
          const parts=dtP.includes("-")?dtP.split("-"):dtP.split("/").reverse()
          return isPagoRef(parseInt(parts[1]), parseInt(parts[0]))
        }
        return pgtos.some((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); return isPagoRef(parseInt(parts[1]), parseInt(parts[0])) })
      })`;

c = c.slice(0, idxStart) + newFilter + c.slice(idxEnd);

// Ajustar pgtosMes para incluir mês atual
const idxPgtos = c.indexOf('const pgtosMes = pgtos.filter');
if (idxPgtos === -1) { console.log('NAO ENCONTRADO: pgtosMes'); process.exit(1); }
const idxPgtosEnd = c.indexOf('\n', idxPgtos);
const newPgtosMes = `const pgtosMes = pgtos.filter((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); const m=parseInt(parts[1]); const a=parseInt(parts[0]); return (m===mesAntIdx+1&&a===anoAnt)||(m===mesAtualIdx2+1&&a===anoAtual2) })`;

c = c.slice(0, idxPgtos) + newPgtosMes + c.slice(idxPgtosEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', c, 'utf8');
console.log('OK');
