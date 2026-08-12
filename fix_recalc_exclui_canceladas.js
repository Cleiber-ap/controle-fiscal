const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

const anchor = "const todasNotas = await api.get('/notas/' + emp).then((r: any) => r.data).catch(() => [])\r\n" +
"          const porMesRecalc: Record<string, number> = {}\r\n" +
"          todasNotas.filter((n: any) => { const st = (n.nat_operacao || n.status || '').toLowerCase(); return (st.includes('venda') && !st.includes('devolu')) || st.includes('complemento de frete') || st.includes('complementar') }).forEach((n: any) => {";
const idx = c.indexOf(anchor);
if (idx === -1) { console.log("FALHOU: anchor"); ok = false; }
else {
  const novo = "const todasNotas = await api.get('/notas/' + emp).then((r: any) => r.data).catch(() => [])\r\n" +
"          const canceladasRecalc = new Set(todasNotas.filter((n: any) => n.numero_nf?.endsWith('-CAN')).map((n: any) => n.numero_nf.replace('-CAN', '')))\r\n" +
"          const porMesRecalc: Record<string, number> = {}\r\n" +
"          todasNotas.filter((n: any) => { if (canceladasRecalc.has(n.numero_nf)) return false; const st = (n.nat_operacao || n.status || '').toLowerCase(); return (st.includes('venda') && !st.includes('devolu')) || st.includes('complemento de frete') || st.includes('complementar') }).forEach((n: any) => {";
  c = c.slice(0, idx) + novo + c.slice(idx + anchor.length);
  console.log("OK - recalculo agora exclui notas canceladas (com -CAN correspondente)");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); }
else console.log("Corrigir ancora antes de continuar");
