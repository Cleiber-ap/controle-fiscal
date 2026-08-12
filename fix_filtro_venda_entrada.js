const fs = require("fs");
const f = "C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx";
let c = fs.readFileSync(f, "utf8");
let ok = true;

// 1. Adicionar na lista de checkboxes
const a1 = "['Venda','NF-e COMPLEMENTAR','Complemento de Frete','Simples Remessa','Cancelamento','Inutilizacao','Carta de Correcao','Devolucao de venda de mercadorias','Devolucao de simples remessa']";
const i1 = c.indexOf(a1);
if (i1 === -1) { console.log("FALHOU: 1 lista"); ok = false; }
else {
  const n1 = "['Venda','Venda/Entrada','NF-e COMPLEMENTAR','Complemento de Frete','Simples Remessa','Cancelamento','Inutilizacao','Carta de Correcao','Devolucao de venda de mercadorias','Devolucao de simples remessa']";
  c = c.replace(a1, n1);
  console.log("OK 1: Venda/Entrada adicionado na lista de checkboxes");
}

// 2. Ajustar a logica do filtro para reconhecer o valor especial
const a2 = "const notasFiltradas4 = filtroStatus.length > 0 ? notasFiltradas3.filter((r: any) => { const nat = r.nat_operacao || r.status || ''; const cancelada = nfsCanceladas.has(r.numero_nf); if (filtroStatus.includes('Venda') && cancelada) return false; return filtroStatus.includes(nat); }) : notasFiltradas3";
const i2 = c.indexOf(a2);
if (i2 === -1) { console.log("FALHOU: 2 filtro"); ok = false; }
else {
  const n2 = "const notasFiltradas4 = filtroStatus.length > 0 ? notasFiltradas3.filter((r: any) => { const nat = r.nat_operacao || r.status || ''; const cancelada = nfsCanceladas.has(r.numero_nf); const isEntrada = cancelada && !nfsCanReal.has(r.numero_nf) && nat.toLowerCase().includes('venda'); if (filtroStatus.includes('Venda/Entrada') && isEntrada) return true; if (filtroStatus.includes('Venda') && cancelada) return false; return filtroStatus.includes(nat); }) : notasFiltradas3";
  c = c.replace(a2, n2);
  console.log("OK 2: filtro reconhece Venda/Entrada como categoria propria");
}

if (ok) { fs.writeFileSync(f, c, "utf8"); console.log("TUDO OK"); }
else console.log("Corrigir ancoras antes de continuar (NADA foi salvo)");
