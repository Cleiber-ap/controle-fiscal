const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// 1. Adicionar CNPJs das empresas como constante
c = c.replace(
  "interface NFParsed {",
  `const CNPJ_EMPRESAS: Record<string, string> = {
  'six': '09648409000193',
  'enova': '38345220000120',
}

interface NFParsed {`
);

// 2. Adicionar campo cnpjEmitente no retorno do parseXML (nota de venda)
// Buscar o return da nota de venda normal e adicionar cnpjEmitente
c = c.replace(
  "    const get = (tag: string) => doc.getElementsByTagName(tag)[0]?.textContent?.trim() || ''\n\n    const numero_nf = get('nNF')",
  `    const get = (tag: string) => doc.getElementsByTagName(tag)[0]?.textContent?.trim() || ''

    // CNPJ do emitente para validação
    const emitEl = doc.getElementsByTagName('emit')[0]
    const cnpjEmitente = emitEl?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || ''

    const numero_nf = get('nNF')`
);

// 3. Adicionar cnpjEmitente no objeto retornado
c = c.replace(
  "      arquivo,\n      refNFe: refNFe || undefined,",
  "      arquivo,\n      cnpjEmitente,\n      refNFe: refNFe || undefined,"
);

// 4. Adicionar cnpjEmitente na interface NFParsed
c = c.replace(
  "  refNFe?: string\n  mesEmissao?: number",
  "  refNFe?: string\n  cnpjEmitente?: string\n  mesEmissao?: number"
);

// 5. Filtrar por CNPJ ao processar arquivos
c = c.replace(
  "      const nf = parseXML(texto, file.name)\n      if (nf) {\n        novasNotas.push(nf)\n      } else {\n        novosErros.push(`${file.name} — não foi possível extrair dados da NF`)\n      }",
  `      const nf = parseXML(texto, file.name)
      if (nf) {
        // Validar CNPJ do emitente
        const cnpjEsperado = CNPJ_EMPRESAS[empresa]
        if (nf.cnpjEmitente && cnpjEsperado && nf.cnpjEmitente !== cnpjEsperado) {
          novosErros.push(\`\${file.name} — CNPJ do emitente (\${nf.cnpjEmitente}) não corresponde à empresa selecionada\`)
        } else {
          novasNotas.push(nf)
        }
      } else {
        novosErros.push(\`\${file.name} — não foi possível extrair dados da NF\`)
      }`
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
