const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("'N") && lines[i].includes("Tipo','Destinat")) {
    const th = "fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#7B82A0', borderBottom: '1px solid #252836', whiteSpace: 'nowrap' as const";
    const newLines = [
      `                  <th style={{ ${th}, padding: '8px 6px', width: '70px' }}>N\u00BA NF</th>`,
      `                  <th style={{ ${th}, padding: '8px 4px', width: '28px', textAlign: 'center' as const }}>Tipo</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px' }}>Destinat\u00e1rio</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px' }}>CNPJ Dest.</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px', textAlign: 'right' as const }}>Valor NF</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px', textAlign: 'right' as const }}>Dt. Emiss\u00e3o</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px', textAlign: 'right' as const }}>Valor Pago</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px', textAlign: 'right' as const }}>Restante</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px', textAlign: 'right' as const }}>Dt. Pagto</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px', textAlign: 'right' as const }}>Imposto</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px', textAlign: 'center' as const }}>Ajuste</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px' }}>Status</th>`,
      `                  <th style={{ ${th}, padding: '8px 12px' }}></th>`,
    ];
    lines.splice(i, 3, ...newLines);
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
