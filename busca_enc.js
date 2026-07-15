const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Encargos/index.tsx', 'utf8');

// Buscar inputs
let pos = 0;
let i = 0;
while ((pos = c.indexOf('<input', pos)) !== -1) {
  const end = c.indexOf('/>', pos) + 2;
  const trecho = c.slice(pos, end);
  if (trecho.includes('salvarHoras') || trecho.includes('pctHE') || trecho.includes('faltasAtrasos')) {
    console.log('--- INPUT', i++, '---');
    console.log(JSON.stringify(trecho.substring(0, 200)));
  }
  pos++;
}
