const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const idx = c.indexOf('setResultado(`\u2705');
if (idx === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
const insert = `        for (const key of Object.keys(porMes)) {\n          const [a, m] = key.split('-')\n          await historicoAPI.upsert({ empresa_id: empIdDetectado, ano: +a, mes: +m, valor: porMes[key] })\n        }\n      }\n      `;
c = c.slice(0, idx) + insert + c.slice(idx);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
