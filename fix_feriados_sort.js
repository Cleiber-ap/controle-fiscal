const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split(
  "{feriadosCustom.map((f:any)=>(\n"
).join(
  "{[...feriadosCustom].sort((a:any,b:any)=> a.mes !== b.mes ? a.mes - b.mes : a.dia - b.dia).map((f:any)=>(\n"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
