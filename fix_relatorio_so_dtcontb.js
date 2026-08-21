const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "if(pgtosMes.length>0){\r\n" +
"          pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||\"\",emp,n.cnpj_dest||\"\",n.destinatario||\"\",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.data_contabilizacao),(n.nat_operacao||n.status||\"\")+(nfsCan.has(n.numero_nf)?(nfsCanReal.has(n.numero_nf)?\"/Cancelada\":\"/Entrada\"):\"\")]))\r\n" +
"        } else {\r\n" +
"          rows.push([n.numero_nf||\"\",emp,n.cnpj_dest||\"\",n.destinatario||\"\",parseFloat(n.valor_nf)||0,dtEm,n.valor_pago?parseFloat(n.valor_pago):null,parseDate(n.data_contabilizacao),(n.nat_operacao||n.status||\"\")+(nfsCan.has(n.numero_nf)?(nfsCanReal.has(n.numero_nf)?\"/Cancelada\":\"/Entrada\"):\"\")])\r\n" +
"        }";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const statusTxt = (n.nat_operacao||n.status||\"\")+(nfsCan.has(n.numero_nf)?(nfsCanReal.has(n.numero_nf)?\"/Cancelada\":\"/Entrada\"):\"\")\r\n" +
"        const isPagoRefLocal = (mes: number, ano: number) => (mes===mesAntIdx+1&&ano===anoAnt) || (mes===mesAtualIdx2+1&&ano===anoAtual2)\r\n" +
"        if(pgtosMes.length>0){\r\n" +
"          pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||\"\",emp,n.cnpj_dest||\"\",n.destinatario||\"\",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.data_contabilizacao),statusTxt]))\r\n" +
"        } else if (pgtos.length === 0) {\r\n" +
"          const dtC = n.data_contabilizacao\r\n" +
"          let valorOk: number | null = null\r\n" +
"          let dtOk: Date | null = null\r\n" +
"          if (dtC) {\r\n" +
"            const parts = dtC.includes(\"-\")?dtC.split(\"-\"):dtC.split(\"/\").reverse()\r\n" +
"            if (isPagoRefLocal(parseInt(parts[1]), parseInt(parts[0]))) {\r\n" +
"              valorOk = n.valor_pago ? parseFloat(n.valor_pago) : null\r\n" +
"              dtOk = parseDate(dtC)\r\n" +
"            }\r\n" +
"          }\r\n" +
"          rows.push([n.numero_nf||\"\",emp,n.cnpj_dest||\"\",n.destinatario||\"\",parseFloat(n.valor_nf)||0,dtEm,valorOk,dtOk,statusTxt])\r\n" +
"        } else {\r\n" +
"          rows.push([n.numero_nf||\"\",emp,n.cnpj_dest||\"\",n.destinatario||\"\",parseFloat(n.valor_nf)||0,dtEm,null,null,statusTxt])\r\n" +
"        }";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - relatorio so mostra valor pago quando DT.CONTB estiver preenchida e bater o mes");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
