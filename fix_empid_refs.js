const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(path, 'utf8');

// Linha 373: empId no lookup da nota original - usar empIdDetectado
c = c.replace(
  "const res = await api.get('/notas/' + empId)",
  "const res = await api.get('/notas/' + empIdDetectado)"
);

// Linha 395: empId nos ajustes de devolução - usar empIdDetectado
c = c.replace(
  "empresa_id: empId, ano: anoOrig, mes: mesOrig,",
  "empresa_id: empIdDetectado, ano: anoOrig, mes: mesOrig,"
);

// Linha 415: empIdDetectado fora de escopo no historico
// Precisamos usar notaFinal.empresa_id que é definido antes
c = c.replace(
  "await api.post('/dados/historico/upsert', { empresa_id: empIdDetectado, ano: parseInt(ano), mes: parseInt(mes), valor })",
  "await api.post('/dados/historico/upsert', { empresa_id: notaFinal.empresa_id, ano: parseInt(ano), mes: parseInt(mes), valor })"
);

fs.writeFileSync(path, c, 'utf8');
console.log('OK');
