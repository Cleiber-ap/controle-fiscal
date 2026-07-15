const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', 'utf8');

// Substituir o carregamento individual por carregamento em lote
const oldLoad = `      const todasNotas = [...n1, ...n2]
      const pgtoPromises = todasNotas.map((n: any) => {
        const eid = n1.includes(n) ? 1 : 2
        return api.get('/notas/pagamentos/' + eid + '/' + n.numero_nf).then((r: any) => ({ nf: n.numero_nf, lista: r.data })).catch(() => ({ nf: n.numero_nf, lista: [] }))
      })
      Promise.all(pgtoPromises).then((res: any[]) => {
        const map: Record<string, any[]> = {}
        res.forEach(({ nf, lista }) => { map[nf] = lista })
        setPagamentos(map)
      })`;

const newLoad = `      // Carregar todos os pagamentos de uma vez (mais eficiente)
      Promise.all([
        api.get('/notas/pagamentos/1').then((r: any) => r.data).catch(() => ({})),
        api.get('/notas/pagamentos/2').then((r: any) => r.data).catch(() => ({})),
      ]).then(([pg1, pg2]) => {
        setPagamentos({ ...pg1, ...pg2 })
      })`;

if (!c.includes(oldLoad)) { console.log('NAO ENCONTRADO'); process.exit(1); }
c = c.replace(oldLoad, newLoad);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ExportarExcel/index.tsx', c, 'utf8');
console.log('OK');
