const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
// Status: linhas 673-677 (5 linhas), Ajuste: linha 678 (1 linha)
const statusLines = lines.slice(673, 678);
const ajusteLine = lines[678];
lines[673] = ajusteLine;
lines[674] = statusLines[0];
lines[675] = statusLines[1];
lines[676] = statusLines[2];
lines[677] = statusLines[3];
lines[678] = statusLines[4];
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
