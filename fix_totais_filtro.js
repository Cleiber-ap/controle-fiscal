const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 768; i < 774; i++) {
  if (lines[i] && lines[i].includes('fmtR(tNF)')) {
    lines[i] = lines[i].replace('fmtR(tNF)', "fmtR((filtroMesEmissao || filtroMesPagto || filtroTipo) ? notasFiltradas3.filter((r:any) => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf)).reduce((s:number,r:any) => s + (parseFloat(r.valor_nf)||0), 0) : tNF)");
    console.log('tNF OK');
  }
  if (lines[i] && lines[i].includes('fmtR(tPago)')) {
    lines[i] = lines[i].replace('fmtR(tPago)', "fmtR((filtroMesEmissao || filtroMesPagto || filtroTipo) ? notasFiltradas3.filter((r:any) => isVendaOuParcial(r) && !nfsCanceladas.has(r.numero_nf) && r.valor_pago).reduce((s:number,r:any) => s + (parseFloat(r.valor_pago)||0), 0) : tPago)");
    console.log('tPago OK');
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
