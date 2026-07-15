const fs = require('fs');
const f = 'C:/projetos/controle-fiscal/frontend/src/api/endpoints.ts';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('listar: (empresaId: number) => api.get(`/dados/historico/') && lines[i+1] && lines[i+1].trimEnd() === '}') {
    lines.splice(i+1, 0, '  upsert: (data: any) => api.post(\'/dados/historico/upsert\', data),');
    console.log('OK linha', i+2);
    break;
  }
}
fs.writeFileSync(f, lines.join('\n'), 'utf8');
