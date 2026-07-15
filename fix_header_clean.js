const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const thStyle = "{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#7B82A0', borderBottom: '1px solid #252836', whiteSpace: 'nowrap' as const, padding: '8px 12px' }";
const newHeader = [
  `                  <th style=${thStyle}>N\u00BA NF</th>`,
  `                  <th style=${thStyle}>Tipo</th>`,
  `                  <th style=${thStyle}>Destinat\u00e1rio</th>`,
  `                  <th style=${thStyle}>CNPJ Dest.</th>`,
  `                  <th style={{ ...${thStyle.slice(1,-1)}, textAlign: 'right' as const }}>Valor NF</th>`,
  `                  <th style={{ ...${thStyle.slice(1,-1)}, textAlign: 'right' as const }}>Dt. Emiss\u00e3o</th>`,
  `                  <th style={{ ...${thStyle.slice(1,-1)}, textAlign: 'right' as const }}>Valor Pago</th>`,
  `                  <th style={{ ...${thStyle.slice(1,-1)}, textAlign: 'right' as const }}>Restante</th>`,
  `                  <th style={{ ...${thStyle.slice(1,-1)}, textAlign: 'right' as const }}>Dt. Pagto</th>`,
  `                  <th style={{ ...${thStyle.slice(1,-1)}, textAlign: 'right' as const }}>Imposto</th>`,
  `                  <th style={{ ...${thStyle.slice(1,-1)}, textAlign: 'center' as const }}>Ajuste</th>`,
  `                  <th style=${thStyle}>Status</th>`,
  `                  <th style=${thStyle}></th>`,
];
// Substituir linhas 480-492
lines.splice(480, 13, ...newHeader);
fs.writeFileSync(f, lines.join('\n'), 'utf8');
console.log('OK');
