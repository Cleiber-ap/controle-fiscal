const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(path, 'utf8');

// Remover o bloco antigo com 'n' fora de escopo
const oldBlock = `        for (const [key, valor] of Object.entries(porMes)) {
          const [ano, mes] = key.split('-')
          // Agrupar por empresa também
        const empIdHist = (n as any).empresaDetectada === 'enova' ? 2 : 1
        await api.post('/dados/historico/upsert', { empresa_id: empIdHist, ano: parseInt(ano), mes: parseInt(mes), valor })
        }`;

if (c.includes(oldBlock)) {
  c = c.replace(oldBlock, '');
  console.log('OK removido bloco duplicado');
} else {
  // Usar indexOf
  const idx = c.indexOf("// Agrupar por empresa também\n        const empIdHist");
  if (idx !== -1) {
    const start = c.lastIndexOf('\n        for (const [key, valor]', idx);
    const end = c.indexOf('\n        }', idx) + '\n        }'.length;
    c = c.slice(0, start) + c.slice(end);
    console.log('OK removido via indexOf');
  } else {
    console.log('NAO ENCONTRADO');
  }
}

fs.writeFileSync(path, c, 'utf8');
console.log('OK final');
