const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const widths = [null, null, '160px', '130px', '100px', '85px', '100px', '90px', '85px', '90px', null, '150px', '50px'];
let thCount = 0;
for (let i = 472; i < 486; i++) {
  if (lines[i] && lines[i].includes('<th ')) {
    const w = widths[thCount];
    if (w && !lines[i].includes("width:")) {
      lines[i] = lines[i].replace("padding: '8px 12px'", `padding: '8px 12px', width: '${w}'`);
      console.log('OK th', thCount, w);
    }
    thCount++;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
