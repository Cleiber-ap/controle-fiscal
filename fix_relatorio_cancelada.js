const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// rows.push com pagamentos parciais
const anchor1 = 'pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.data_contabilizacao),n.nat_operacao||n.status||""]))';
const idx1 = c.indexOf(anchor1);
if (idx1 === -1) { console.log("FALHOU: anchor1"); ok = false; }
else {
  const novo1 = 'pgtosMes.forEach((p:any)=>rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,parseFloat(p.valor_pago)||0,parseDate(p.data_contabilizacao),(n.nat_operacao||n.status||"")+(nfsCan.has(n.numero_nf)?"/Cancelada":"")]))';
  c = c.replace(anchor1, novo1);
  console.log("OK: linha com pagamento marca cancelada");
}

// rows.push sem historico
const anchor2 = 'rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,n.valor_pago?parseFloat(n.valor_pago):null,parseDate(n.data_contabilizacao),n.nat_operacao||n.status||""])';
const idx2 = c.indexOf(anchor2);
if (idx2 === -1) { console.log("FALHOU: anchor2"); ok = false; }
else {
  const novo2 = 'rows.push([n.numero_nf||"",emp,n.cnpj_dest||"",n.destinatario||"",parseFloat(n.valor_nf)||0,dtEm,n.valor_pago?parseFloat(n.valor_pago):null,parseDate(n.data_contabilizacao),(n.nat_operacao||n.status||"")+(nfsCan.has(n.numero_nf)?"/Cancelada":"")])';
  c = c.replace(anchor2, novo2);
  console.log("OK: linha sem pagamento marca cancelada");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar");
