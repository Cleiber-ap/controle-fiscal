const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "const notasFiltradas4 = filtroStatus.length > 0 ? notasFiltradas3.filter((r: any) => filtroStatus.includes(r.nat_operacao || r.status || '')) : notasFiltradas3";
const novo = "const notasFiltradas4 = filtroStatus.length > 0 ? notasFiltradas3.filter((r: any) => { const nat = r.nat_operacao || r.status || ''; const cancelada = nfsCanceladas.has(r.numero_nf); if (filtroStatus.includes('Venda') && cancelada) return false; return filtroStatus.includes(nat); }) : notasFiltradas3";
if (c.indexOf(old) === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
