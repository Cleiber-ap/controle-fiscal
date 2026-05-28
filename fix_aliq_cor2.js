const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split("color:'#34D399',...mono}}>{(emp.aliqEfetiva").join("color:emp.cor,...mono}}>{(emp.aliqEfetiva");

fs.writeFileSync(p, c, 'utf8');
const ok = !c.includes("color:'#34D399',...mono}}>{(emp.aliqEfetiva");
console.log(ok ? 'OK' : 'FALHOU');
