const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(path, 'utf8');

const idxStart = c.indexOf('      {/* Seletor de empresa */}');
const idxEnd = c.indexOf('      {/* Drop zone */}', idxStart);

if (idxStart === -1) { console.log('NAO ENCONTRADO start'); process.exit(1); }
if (idxEnd === -1) { console.log('NAO ENCONTRADO end'); process.exit(1); }

c = c.slice(0, idxStart) + c.slice(idxEnd);

// Remover estado empresa
c = c.replace("  const [empresa, setEmpresa] = useState<'six' | 'enova'>('six')\r\n", "");
c = c.replace("  const [empresa, setEmpresa] = useState<'six' | 'enova'>('six')\n", "");

fs.writeFileSync(path, c, 'utf8');
console.log('OK');
