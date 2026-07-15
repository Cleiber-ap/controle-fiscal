const fs = require('fs');
const c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('empresa') && !l.includes('empresaDetectada') && !l.includes('CNPJ_EMPRESAS') && !l.includes('empId') && !l.includes('empIdDetectado') && !l.includes('empIdHist')) {
    console.log(i+1, l.trim().substring(0, 100));
  }
});
