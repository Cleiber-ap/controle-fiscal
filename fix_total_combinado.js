const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// 1. Remover o card Total SIX/ENOVA do array de cards
c = c.replace(
  "\r\n          { label: 'Total SIX/ENOVA - Aguardando', valor: fmtR(valTotalCombinado), sub: 'SIX + ENOVA aguardando', cor: '#A78BFA' },",
  ""
);

// 2. Mudar o grid de 4 para 3 colunas
c = c.replace(
  "gridTemplateColumns: 'repeat(4,1fr)'",
  "gridTemplateColumns: 'repeat(3,1fr)'"
);

// 3. Adicionar o total combinado à direita do header de empresa ativa
const headerEnd = "        ))}\r\n      </div>";
const headerEndNew = `        ))}\r\n        <div style={{ marginLeft: 'auto', background: '#13161F', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '10px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>\r\n          <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#A78BFA' }}>SIX + ENOVA Aguardando</span>\r\n          <span style={{ fontSize: '16px', fontWeight: 700, color: '#A78BFA', fontFamily: 'monospace' }}>{fmtR(valTotalCombinado)}</span>\r\n        </div>\r\n      </div>`;

if (!c.includes(headerEnd)) { console.log('NAO ENCONTRADO: header end'); process.exit(1); }
c = c.replace(headerEnd, headerEndNew);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
