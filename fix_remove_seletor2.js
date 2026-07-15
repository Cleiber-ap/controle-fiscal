const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

const idxStart = c.indexOf('      {/* Seletor de empresa */}');
const idxEnd = c.indexOf('      {/* Drop zone */}', idxStart);

if (idxStart === -1) { console.log('NAO ENCONTRADO start'); process.exit(1); }
if (idxEnd === -1) { console.log('NAO ENCONTRADO end'); process.exit(1); }

c = c.slice(0, idxStart) + c.slice(idxEnd);

// Remover estado empresa
c = c.replace("  const [empresa, setEmpresa] = useState<'six' | 'enova'>('six')\r\n", "");
c = c.replace("  const [empresa, setEmpresa] = useState<'six' | 'enova'>('six')\n", "");

fs.writeFileSync('C:/projetos\controle-fiscal\frontend\src\pages\ImportarXML\index.tsx', c, 'utf8');
console.log('OK');
