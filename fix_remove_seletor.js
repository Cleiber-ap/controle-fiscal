const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

const idxStart = c.indexOf('      {/* Seletor de empresa */}');
const idxEnd = c.indexOf('\n\n      {/* Drop zone */}', idxStart);

if (idxStart === -1) { console.log('NAO ENCONTRADO start'); process.exit(1); }
if (idxEnd === -1) { console.log('NAO ENCONTRADO end'); process.exit(1); }

c = c.slice(0, idxStart) + c.slice(idxEnd);

// Remover estado empresa que ainda está
c = c.replace("  const [empresa, setEmpresa] = useState<'six' | 'enova'>('six')\n", "");

// Remover isSix/corEmp/bgEmp/empId se ainda existirem
c = c.replace("  const isSix = empresa === 'six'\n  const corEmp = isSix ? '#4F8EF7' : '#34D399'\n  const bgEmp = isSix ? '#1C2E52' : '#0D3326'\n  const empId = isSix ? 1 : 2\n", "  const corEmp = '#4F8EF7'\n  const bgEmp = '#1C2E52'\n");

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
