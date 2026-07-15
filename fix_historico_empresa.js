const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(path, 'utf8');

// Substituir o bloco de historico para usar empresa da nota
c = c.replace(
  "await api.post('/dados/historico/upsert', { empresa_id: notaFinal.empresa_id, ano: parseInt(ano), mes: parseInt(mes), valor })",
  "// Agrupar por empresa também\n        const empIdHist = (n as any).empresaDetectada === 'enova' ? 2 : 1\n        await api.post('/dados/historico/upsert', { empresa_id: empIdHist, ano: parseInt(ano), mes: parseInt(mes), valor })"
);

// Mas o loop porMes não tem acesso a n.empresaDetectada por empresa separada
// Melhor abordagem: usar empresa da primeira nota de venda do mês
// Simplificar: usar empresa_id da propria nota no forEach
c = c.replace(
  `      const notasVenda = notas.filter(n => n.status === 'Venda')
      if (notasVenda.length > 0) {
        // Agrupar por mês/ano
        const porMes: Record<string, number> = {}
        notasVenda.forEach(n => {
          if (n.data_emissao) {
            const [, m, a] = n.data_emissao.split('/')
            const key = \`\${a}-\${m}\`
            porMes[key] = (porMes[key] || 0) + n.valor_nf
          }
        })
        for (const [key, valor] of Object.entries(porMes)) {
          const [ano, mes] = key.split('-')
          // Agrupar por empresa também
        const empIdHist = (n as any).empresaDetectada === 'enova' ? 2 : 1
        await api.post('/dados/historico/upsert', { empresa_id: empIdHist, ano: parseInt(ano), mes: parseInt(mes), valor })
        }
      }`,
  `      const notasVenda = notas.filter(n => n.status === 'Venda')
      if (notasVenda.length > 0) {
        // Agrupar por empresa+mês/ano
        const porEmpresaMes: Record<string, {valor: number, empId: number}> = {}
        notasVenda.forEach(n => {
          if (n.data_emissao) {
            const [, m, a] = n.data_emissao.split('/')
            const empId = (n as any).empresaDetectada === 'enova' ? 2 : 1
            const key = \`\${empId}-\${a}-\${m}\`
            porEmpresaMes[key] = { valor: (porEmpresaMes[key]?.valor || 0) + n.valor_nf, empId }
          }
        })
        for (const [key, { valor, empId }] of Object.entries(porEmpresaMes)) {
          const parts = key.split('-')
          const ano = parts[1], mes = parts[2]
          await api.post('/dados/historico/upsert', { empresa_id: empId, ano: parseInt(ano), mes: parseInt(mes), valor })
        }
      }`
);

fs.writeFileSync(path, c, 'utf8');
console.log('OK');
