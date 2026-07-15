const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(path, 'utf8');

// Corrigir linhas 308-310: isSix referencias
c = c.replace(
  "const corEmp = isSix ? '#4F8EF7' : '#34D399'\r\n  const bgEmp = isSix ? '#1C2E52' : '#0D3326'\r\n  const empId = isSix ? 1 : 2",
  "const corEmp = '#4F8EF7'\r\n  const bgEmp = '#1C2E52'"
);
c = c.replace(
  "const corEmp = isSix ? '#4F8EF7' : '#34D399'\n  const bgEmp = isSix ? '#1C2E52' : '#0D3326'\n  const empId = isSix ? 1 : 2",
  "const corEmp = '#4F8EF7'\n  const bgEmp = '#1C2E52'"
);

// Corrigir linha 416: notaFinal fora de escopo - usar empId da nota do loop
c = c.replace(
  "const empIdHist = notaFinal.empresa_id\n          await api.post('/dados/historico/upsert', { empresa_id: empIdHist,",
  "await api.post('/dados/historico/upsert', { empresa_id: empIdDetectado,"
);

// Corrigir linha 472: isSix no drop zone
c = c.replace(
  "background: dragging ? (isSix ? 'rgba(79,142,247,0.06)' : 'rgba(52,211,153,0.06)') : '#13161F',",
  "background: dragging ? 'rgba(79,142,247,0.06)' : '#13161F',"
);

// Corrigir linha 589: isSix no botao importar
c = c.replace(
  "style={{ padding: '8px 20px', background: isSix ? '#1C2E52' : '#0D3326', border: `1px solid ${isSix ? 'rgba(79,142,247,0.3)' : 'rgba(52,211,153,0.3)'}`, borderRadius: '6px', color: corEmp,",
  "style={{ padding: '8px 20px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '6px', color: corEmp,"
);

fs.writeFileSync(path, c, 'utf8');
console.log('OK');
