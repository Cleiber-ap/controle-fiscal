const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 768; i < 774; i++) {
  if (lines[i] && lines[i].includes('notasFiltradas3.filter((r:any) => isVendaOuParcial(r)')) {
    lines[i] = lines[i].replace(
      /notasFiltradas3\.filter\(\(r:any\) => isVendaOuParcial\(r\) && !nfsCanceladas\.has\(r\.numero_nf\)\)\.reduce\(\(s:number,r:any\) => s \+ \(parseFloat\(r\.valor_nf\)\|\|0\), 0\)/,
      'notasFiltradas3.reduce((s:number,r:any) => s + (parseFloat(r.valor_nf)||0), 0)'
    );
    lines[i] = lines[i].replace(
      /notasFiltradas3\.filter\(\(r:any\) => isVendaOuParcial\(r\) && !nfsCanceladas\.has\(r\.numero_nf\) && r\.valor_pago\)\.reduce\(\(s:number,r:any\) => s \+ \(parseFloat\(r\.valor_pago\)\|\|0\), 0\)/,
      'notasFiltradas3.filter((r:any) => r.valor_pago).reduce((s:number,r:any) => s + (parseFloat(r.valor_pago)||0), 0)'
    );
    console.log('OK linha', i+1);
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
