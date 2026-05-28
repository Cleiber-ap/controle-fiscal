const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx';
let c = fs.readFileSync(p, 'utf8');

// Corrigir await no salvarFeriado (ignora \r\n)
c = c.replace(/showNotif\('Feriado salvo!'\)\s*\n\s*carregar\(\)/, "showNotif('Feriado salvo!')\n    await carregar()");

// Corrigir await no excluirFeriado tambem
c = c.replace(/showNotif\('Feriado removido'\)\s*\n\s*carregar\(\)/, "showNotif('Feriado removido')\n    await carregar()");

fs.writeFileSync(p, c, 'utf8');
console.log('OK - awaits corrigidos');
