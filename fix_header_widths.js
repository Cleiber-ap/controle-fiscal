const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Tipo','Destinat") && lines[i].includes("CNPJ Dest")) {
    const thStyle = "fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '1px', color: '#7B82A0', borderBottom: '1px solid #252836', whiteSpace: 'nowrap' as const, padding: '8px 6px'";
    const newHeader = [
      `                  <th style={{ ${thStyle}, width: '70px' }}>N\u00BA NF</th>`,
      `                  <th style={{ ${thStyle}, width: '28px', textAlign: 'center' as const }}>Tipo</th>`,
      `                  <th style={{ ${thStyle}, width: '180px' }}>Destinat\u00e1rio</th>`,
      `                  <th style={{ ${thStyle}, width: '140px' }}>CNPJ Dest.</th>`,
      `                  <th style={{ ${thStyle}, width: '110px', textAlign: 'right' as const }}>Valor NF</th>`,
      `                  <th style={{ ${thStyle}, width: '90px', textAlign: 'right' as const }}>Dt. Emiss\u00e3o</th>`,
      `                  <th style={{ ${thStyle}, width: '110px', textAlign: 'right' as const }}>Valor Pago</th>`,
      `                  <th style={{ ${thStyle}, width: '100px', textAlign: 'right' as const }}>Restante</th>`,
      `                  <th style={{ ${thStyle}, width: '90px', textAlign: 'right' as const }}>Dt. Pagto</th>`,
      `                  <th style={{ ${thStyle}, width: '100px', textAlign: 'right' as const }}>Imposto</th>`,
      `                  <th style={{ ${thStyle}, width: '30px', textAlign: 'center' as const }}>Ajuste</th>`,
      `                  <th style={{ ${thStyle}, width: '160px' }}>Status</th>`,
      `                  <th style={{ ${thStyle}, width: '60px' }}></th>`,
    ];
    lines.splice(i, 3, ...newHeader);
    console.log('OK linha', i+1);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
