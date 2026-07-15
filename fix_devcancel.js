const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx';
let c = fs.readFileSync(f, 'utf8');
const old = "const nfsCanceladas = new Set(notas.filter(r => r.numero_nf?.endsWith('-CAN')).map(r => r.numero_nf.replace('-CAN', '')))";
const novo = "const nfsCanceladas = new Set([...notas.filter(r => r.numero_nf?.endsWith('-CAN')).map(r => r.numero_nf.replace('-CAN', '')), ...ajustes.filter((aj: any) => aj.nf_referenciada).map((aj: any) => aj.nf_referenciada)])";
if (c.indexOf(old) === -1) { console.log('TRECHO NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old, novo);
fs.writeFileSync(f, c, 'utf8');
console.log('OK');
