const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Trocar data-aguardando por id na tr da linha "Aguardando"
c = c.replace(
  '<tr key={r.numero_nf + \'-prox\'} data-aguardando="true"',
  '<tr key={r.numero_nf + \'-prox\'} id="primeira-aguardando"'
);

// Trocar querySelector para usar id
c = c.replace(
  'const el = (document.querySelector(\'[data-aguardando="true"]\') || document.querySelector(\'[data-aguardando-nf]\')) as HTMLElement',
  "const el = (document.getElementById('primeira-aguardando') || document.querySelector('[data-aguardando-nf]')) as HTMLElement"
);

// Remover data-aguardando-nf do span (não usado mais como fallback principal)
// Manter como está pois é fallback para notas sem pagamento

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
