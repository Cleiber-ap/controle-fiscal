const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// 1. Remover estado empresa e isSix/corEmp/bgEmp/empId
c = c.replace(
  "  const [empresa, setEmpresa] = useState<'six' | 'enova'>('six')\n",
  ""
);
c = c.replace(
  "  const isSix = empresa === 'six'\n  const corEmp = isSix ? '#4F8EF7' : '#34D399'\n  const bgEmp = isSix ? '#1C2E52' : '#0D3326'\n  const empId = isSix ? 1 : 2\n",
  "  const corEmp = '#4F8EF7'\n  const bgEmp = '#1C2E52'\n"
);

// 2. Remover o seletor de empresa do JSX
const idxSeletor = c.indexOf('      {/* Seletor de empresa */}');
if (idxSeletor !== -1) {
  const idxSeletorEnd = c.indexOf('\n\n      {/* Drop zone */}', idxSeletor);
  if (idxSeletorEnd !== -1) {
    c = c.slice(0, idxSeletor) + c.slice(idxSeletorEnd);
    console.log('OK seletor removido');
  } else { console.log('NAO ENCONTRADO: seletor end'); }
} else { console.log('NAO ENCONTRADO: seletor start'); }

// 3. Atualizar processarArquivos para não usar empresa como parâmetro
c = c.replace(
  "  async function processarArquivos(files: FileList, empresaAtual: string = empresa) {",
  "  async function processarArquivos(files: FileList) {"
);

// 4. Atualizar o filtro de CNPJ para usar empresa detectada do XML
c = c.replace(
  `        const cnpjEsperado = CNPJ_EMPRESAS[empresaAtual]
        if (nf.cnpjEmitente && cnpjEsperado && nf.cnpjEmitente !== cnpjEsperado) {
          novosErros.push(\`\${file.name} — CNPJ emitente (\${nf.cnpjEmitente}) não corresponde à empresa selecionada\`)
        } else {
          novasNotas.push(nf)
        }`,
  `        // Detectar empresa pelo CNPJ do emitente
        const empresaDetectada = nf.cnpjEmitente === '09648409000193' ? 'six' : nf.cnpjEmitente === '38345220000120' ? 'enova' : null
        if (!empresaDetectada) {
          novosErros.push(\`\${file.name} — CNPJ emitente (\${nf.cnpjEmitente || 'não encontrado'}) não reconhecido\`)
        } else {
          novasNotas.push({...nf, empresaDetectada})
        }`
);

// 5. Atualizar chamadas de processarArquivos para remover empresa
c = c.replace(
  "if (e.dataTransfer.files.length > 0) processarArquivos(e.dataTransfer.files, empresa)",
  "if (e.dataTransfer.files.length > 0) processarArquivos(e.dataTransfer.files)"
);
c = c.replace(
  "if (e.target.files?.length) processarArquivos(e.target.files, empresa)",
  "if (e.target.files?.length) processarArquivos(e.target.files)"
);

// 6. Atualizar o reset ao trocar empresa para remover referência
c = c.replace(
  "{ setEmpresa(e.key as any); setNotas([]); setErros([]); setResultado(null) }",
  "{ setNotas([]); setErros([]); setResultado(null) }"
);

// 7. Atualizar a função importar para usar empresaDetectada
c = c.replace(
  "        let notaFinal = { ...nota, empresa_id: empId }",
  "        const empIdDetectado = (nota as any).empresaDetectada === 'six' ? 1 : 2\n        let notaFinal = { ...nota, empresa_id: empIdDetectado }"
);

// 8. Atualizar historico para usar empresa detectada
c = c.replace(
  "          await api.post('/dados/historico/upsert', { empresa_id: empId, ano: parseInt(ano), mes: parseInt(mes), valor })",
  "          const empIdHist = notaFinal.empresa_id\n          await api.post('/dados/historico/upsert', { empresa_id: empIdHist, ano: parseInt(ano), mes: parseInt(mes), valor })"
);

// 9. Atualizar o log de auditoria
c = c.replace(
  "descricao: `${importadas} nota${importadas !== 1 ? 's' : ''} importada${importadas !== 1 ? 's' : ''} via XML · Empresa: ${empresa.toUpperCase()} · ${notasVenda.length} Venda`",
  "descricao: `${importadas} nota${importadas !== 1 ? 's' : ''} importada${importadas !== 1 ? 's' : ''} via XML · ${notasVenda.length} Venda`"
);

// 10. Atualizar badge de cor por nota no preview - usar empresaDetectada
c = c.replace(
  "style={{ ...mono, fontSize: '12px', fontWeight: 700, color: corEmp, background: bgEmp, padding: '2px 8px', borderRadius: '6px' }}",
  "style={{ ...mono, fontSize: '12px', fontWeight: 700, color: (n as any).empresaDetectada === 'enova' ? '#34D399' : '#4F8EF7', background: (n as any).empresaDetectada === 'enova' ? '#0D3326' : '#1C2E52', padding: '2px 8px', borderRadius: '6px' }}"
);

// 11. Atualizar info de lançamento automático
c = c.replace(
  "Somatória das NFs de <strong style={{ color: '#34D399' }}>Venda</strong> do mês será gravada automaticamente no histórico de faturamento · Empresa: <strong style={{ color: corEmp }}>{isSix ? 'SIX' : 'ENOVA'} Comercial</strong>",
  "Somatória das NFs de <strong style={{ color: '#34D399' }}>Venda</strong> do mês será gravada automaticamente no histórico de faturamento · Empresa detectada pelo CNPJ do emitente"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK final');
