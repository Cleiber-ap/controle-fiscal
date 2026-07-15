const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('COLEGIO') || (lines[i].includes('destinatario') && lines[i].includes('Pagamento parcial') && lines[i].includes('idx'))) {
    console.log('Linha', i+1, ':', lines[i].substring(0, 100));
  }
}
