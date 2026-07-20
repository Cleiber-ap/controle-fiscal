const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Cabecalho da coluna
const anchor1 = 'const cab = ["Nº NF","RzEmit","CnpjDest","RzDest","Valor NF","DtEmissao","Valor Pago","Data do Pagto","Status Nota Fiscal"]';
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = 'const cab = ["Nº NF","RzEmit","CnpjDest","RzDest","Valor NF","DtEmissao","Valor Pago","Data Contabilização","Status Nota Fiscal"]';
  c = c.replace(anchor1, novo1);
  console.log("OK: cabecalho atualizado");
}

// 2. notasPagas
const anchor2 = "const mesAtualIdx2 = now.getMonth()\n      const anoAtual2 = now.getFullYear()\n      const notasPagas = listaFiltrada.filter((n:any)=>{\n        const pgtos=pagamentos[n.numero_nf]||[]\n        const isPagoRef = (mes: number, ano: number) =>\n          (mes===mesAntIdx+1&&ano===anoAnt) || (mes===mesAtualIdx2+1&&ano===anoAtual2)\n        if(pgtos.length===0){\n          const dtP=n.dt_pagamento||n.data_pagamento; if(!dtP) return false\n          const parts=dtP.includes(\"-\")?dtP.split(\"-\"):dtP.split(\"/\").reverse()\n          return isPagoRef(parseInt(parts[1]), parseInt(parts[0]))\n        }\n        return pgtos.some((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes(\"-\")?dt.split(\"-\"):dt.split(\"/\").reverse(); return isPagoRef(parseInt(parts[1]), parseInt(parts[0])) })\n      })";
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = "const mesAtualIdx2 = now.getMonth()\n      const anoAtual2 = now.getFullYear()\n      const notasPagas = listaFiltrada.filter((n:any)=>{\n        const pgtos=pagamentos[n.numero_nf]||[]\n        const isPagoRef = (mes: number, ano: number) =>\n          (mes===mesAntIdx+1&&ano===anoAnt) || (mes===mesAtualIdx2+1&&ano===anoAtual2)\n        if(pgtos.length===0){\n          const dtP=n.data_contabilizacao; if(!dtP) return false\n          const parts=dtP.includes(\"-\")?dtP.split(\"-\"):dtP.split(\"/\").reverse()\n          return isPagoRef(parseInt(parts[1]), parseInt(parts[0]))\n        }\n        return pgtos.some((p:any)=>{ const dt=p.data_contabilizacao; if(!dt) return false; const parts=dt.includes(\"-\")?dt.split(\"-\"):dt.split(\"/\").reverse(); return isPagoRef(parseInt(parts[1]), parseInt(parts[0])) })\n      })";
  c = c.slice(0, idx2) + novo2 + c.slice(idx2 + anchor2.length);
  console.log("OK: notasPagas usa data_contabilizacao");
}

// 3. pgtosMes filter
const anchor3 = 'const pgtosMes = pgtos.filter((p:any)=>{ const dt=p.dt_pagamento; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); const m=parseInt(parts[1]); const a=parseInt(parts[0]); return (m===mesAntIdx+1&&a===anoAnt)||(m===mesAtualIdx2+1&&a===anoAtual2) })';
const idx3 = c.indexOf(anchor3);
if (idx3 === -1) { console.log("FALHOU: anchor3"); ok = false; }
else {
  const novo3 = 'const pgtosMes = pgtos.filter((p:any)=>{ const dt=p.data_contabilizacao; if(!dt) return false; const parts=dt.includes("-")?dt.split("-"):dt.split("/").reverse(); const m=parseInt(parts[1]); const a=parseInt(parts[0]); return (m===mesAntIdx+1&&a===anoAnt)||(m===mesAtualIdx2+1&&a===anoAtual2) })';
  c = c.replace(anchor3, novo3);
  console.log("OK: pgtosMes usa data_contabilizacao");
}

// 4. rows.push (com pagamentos)
const anchor4 = 'pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.dt_pagamento),n.nat_operacao||n.status||""]))';
const idx4 = c.indexOf(anchor4);
if (idx4 === -1) { console.log("FALHOU: anchor4"); ok = false; }
else {
  const novo4 = 'pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.data_contabilizacao),n.nat_operacao||n.status||""]))';
  c = c.replace(anchor4, novo4);
  console.log("OK: rows.push (parciais) usa data_contabilizacao");
}

// 5. rows.push (sem historico)
const anchor5 = 'rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,n.valor_pago?parseFloat(n.valor_pago):null,parseDate(n.dt_pagamento||n.data_pagamento),n.nat_operacao||n.status||""])';
const idx5 = c.indexOf(anchor5);
if (idx5 === -1) { console.log("FALHOU: anchor5"); ok = false; }
else {
  const novo5 = 'rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,n.valor_pago?parseFloat(n.valor_pago):null,parseDate(n.data_contabilizacao),n.nat_operacao||n.status||""])';
  c = c.replace(anchor5, novo5);
  console.log("OK: rows.push (unica) usa data_contabilizacao");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK - relatorio migrado para DT.CONTB"); }
else console.log("Corrigir ancoras antes de continuar");
