const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/backend/app/routers/notas.py';
let c = fs.readFileSync(f, 'utf8');

// Adicionar coluna no modelo
const old1 = "    ajustado = Column(Boolean, default=False, nullable=True)";
const novo1 = "    ajustado = Column(Boolean, default=False, nullable=True)\n    tipo = Column(String(10), default='saida', nullable=True)";
if (c.indexOf(old1) === -1) { console.log('TRECHO 1 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old1, novo1);

// Adicionar tipo no retorno da API
const old2 = '        "ajustado": n.ajustado or False,';
const novo2 = '        "ajustado": n.ajustado or False,\n        "tipo": n.tipo or "saida",';
if (c.indexOf(old2) === -1) { console.log('TRECHO 2 NAO ENCONTRADO'); process.exit(1); }
c = c.replace(old2, novo2);

fs.writeFileSync(f, c, 'utf8');
console.log('OK');
