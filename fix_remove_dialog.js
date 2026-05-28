const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

c = c.replace(
  /\/\/ Verificar se devolucao e do mes seguinte ao original[\s\S]*?} catch\(e\) \{ console\.warn\('Ajuste devolucao nao registrado', e\) \}/,
  "} catch(e) { console.warn('Ajuste devolucao nao registrado', e) }"
);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
