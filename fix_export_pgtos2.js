const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', 'utf8');

const idxStart = c.indexOf('const todasNotas = [...n1, ...n2]');
if (idxStart === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }

const idxEnd = c.indexOf('setPagamentos(map)\n      })\n    }).finally', idxStart);
if (idxEnd === -1) {
  // tentar com \r\n
  const idxEnd2 = c.indexOf('setPagamentos(map)\r\n      })\r\n    }).finally', idxStart);
  if (idxEnd2 === -1) { console.log('NAO ENCONTRADO: end'); process.exit(1); }
  const endPos = idxEnd2 + 'setPagamentos(map)\r\n      })'.length;
  const newBlock = `// Carregar todos os pagamentos de uma vez\n      Promise.all([\n        api.get('/notas/pagamentos/1').then((r: any) => r.data).catch(() => ({})),\n        api.get('/notas/pagamentos/2').then((r: any) => r.data).catch(() => ({})),\n      ]).then(([pg1, pg2]) => {\n        setPagamentos({ ...pg1, ...pg2 })\n      })`;
  c = c.slice(0, idxStart) + newBlock + c.slice(endPos);
} else {
  const endPos = idxEnd + 'setPagamentos(map)\n      })'.length;
  const newBlock = `// Carregar todos os pagamentos de uma vez\n      Promise.all([\n        api.get('/notas/pagamentos/1').then((r: any) => r.data).catch(() => ({})),\n        api.get('/notas/pagamentos/2').then((r: any) => r.data).catch(() => ({})),\n      ]).then(([pg1, pg2]) => {\n        setPagamentos({ ...pg1, ...pg2 })\n      })`;
  c = c.slice(0, idxStart) + newBlock + c.slice(endPos);
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', c, 'utf8');
console.log('OK');
