const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Inicio/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.split("(empSix.credito_icms * 100).toFixed(2).replace('.', ',') + '%'")
     .join("(icmsAproveitavelSix * 100).toFixed(2).replace('.', ',') + '%'");

c = c.split("(empEnova.credito_icms * 100).toFixed(2).replace('.', ',') + '%'")
     .join("(icmsAproveitavelEnova * 100).toFixed(2).replace('.', ',') + '%'");

fs.writeFileSync(p, c, 'utf8');

const ok = !c.includes('empSix.credito_icms * 100') && !c.includes('empEnova.credito_icms * 100');
console.log(ok ? 'OK - substituido' : 'FALHOU');
