const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const dtNoMesFiltro')) {
    lines.splice(i, 0, '  const notasFiltradas3 = filtroTipo ? notasFiltradas2.filter((r: any) => (r.tipo || \'saida\') === filtroTipo) : notasFiltradas2');
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
