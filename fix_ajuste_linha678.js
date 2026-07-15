const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
if (lines[678].includes('tdBase')) {
  lines[678] = lines[678].replace("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })", "tdSm({ textAlign: 'center' })");
  console.log('OK 679');
}
if (lines[679].includes('tdBase')) {
  lines[679] = lines[679].replace("tdBase({ textAlign: 'center', whiteSpace: 'nowrap' })", "tdSm({ textAlign: 'center', whiteSpace: 'nowrap' })");
  console.log('OK 680');
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
