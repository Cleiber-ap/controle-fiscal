const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Verificar se CNPJ_EMPRESAS já foi inserido
if (!c.includes('CNPJ_EMPRESAS')) {
  c = c.replace(
    "interface NFParsed {",
    "const CNPJ_EMPRESAS: Record<string, string> = {\n  'six': '09648409000193',\n  'enova': '38345220000120',\n}\n\ninterface NFParsed {"
  );
}

// Adicionar cnpjEmitente na interface se não existir
if (!c.includes('cnpjEmitente?')) {
  c = c.replace(
    "  refNFe?: string",
    "  cnpjEmitente?: string\n  refNFe?: string"
  );
}

// Adicionar extração do CNPJ emitente na função parseXML (nota de venda normal)
// Localizar pela linha "const numero_nf = get('nNF')"
const idxNNF = c.lastIndexOf("const numero_nf = get('nNF')");
if (idxNNF === -1) { console.log('NAO ENCONTRADO: nNF'); process.exit(1); }

// Verificar se já foi adicionado
if (!c.includes('cnpjEmitente =')) {
  // Inserir antes de "const numero_nf"
  const insertAt = c.lastIndexOf('\n', idxNNF);
  const toInsert = "\n    const emitEl2 = doc.getElementsByTagName('emit')[0]\n    const cnpjEmitente = emitEl2?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || ''\n";
  c = c.slice(0, insertAt) + toInsert + c.slice(insertAt);
}

// Adicionar cnpjEmitente no objeto retornado da nota de venda
if (!c.includes('cnpjEmitente,')) {
  c = c.replace(
    "      arquivo,\n      refNFe: refNFe || undefined,",
    "      arquivo,\n      cnpjEmitente,\n      refNFe: refNFe || undefined,"
  );
}

// Substituir o bloco de processamento para adicionar filtro por CNPJ
const oldProcess = "      const nf = parseXML(texto, file.name)\n      if (nf) {\n        novasNotas.push(nf)\n      } else {\n        novosErros.push(`${file.name} — não foi possível extrair dados da NF`)\n      }";

if (c.includes(oldProcess)) {
  c = c.replace(oldProcess, `      const nf = parseXML(texto, file.name)
      if (nf) {
        const cnpjEsperado = CNPJ_EMPRESAS[empresa]
        if (nf.cnpjEmitente && cnpjEsperado && nf.cnpjEmitente !== cnpjEsperado) {
          novosErros.push(\`\${file.name} — CNPJ emitente (\${nf.cnpjEmitente}) não corresponde à empresa selecionada\`)
        } else {
          novasNotas.push(nf)
        }
      } else {
        novosErros.push(\`\${file.name} — não foi possível extrair dados da NF\`)
      }`);
  console.log('OK filtro inserido');
} else {
  // Tentar com \r\n
  const oldProcess2 = "      const nf = parseXML(texto, file.name)\r\n      if (nf) {\r\n        novasNotas.push(nf)\r\n      } else {\r\n        novosErros.push(`${file.name} — não foi possível extrair dados da NF`)\r\n      }";
  if (c.includes(oldProcess2)) {
    c = c.replace(oldProcess2, `      const nf = parseXML(texto, file.name)
      if (nf) {
        const cnpjEsperado = CNPJ_EMPRESAS[empresa]
        if (nf.cnpjEmitente && cnpjEsperado && nf.cnpjEmitente !== cnpjEsperado) {
          novosErros.push(\`\${file.name} — CNPJ emitente (\${nf.cnpjEmitente}) não corresponde à empresa selecionada\`)
        } else {
          novasNotas.push(nf)
        }
      } else {
        novosErros.push(\`\${file.name} — não foi possível extrair dados da NF\`)
      }`);
    console.log('OK filtro inserido (CRLF)');
  } else {
    // Usar indexOf
    const idxParse = c.indexOf("const nf = parseXML(texto, file.name)");
    if (idxParse === -1) { console.log('NAO ENCONTRADO: processarArquivos'); process.exit(1); }
    const idxIfNf = c.indexOf("if (nf) {", idxParse);
    const idxPush = c.indexOf("novasNotas.push(nf)", idxIfNf);
    const idxEndIf = c.indexOf("}", idxPush) + 1;
    // Substituir o bloco if inteiro
    const oldBlock = c.slice(idxIfNf, c.indexOf("}\n      }", idxIfNf) + "}\n      }".length);
    const newBlock = `if (nf) {
        const cnpjEsperado = CNPJ_EMPRESAS[empresa]
        if (nf.cnpjEmitente && cnpjEsperado && nf.cnpjEmitente !== cnpjEsperado) {
          novosErros.push(\`\${file.name} — CNPJ emitente (\${nf.cnpjEmitente}) não corresponde à empresa selecionada\`)
        } else {
          novasNotas.push(nf)
        }
      } else {
        novosErros.push(\`\${file.name} — não foi possível extrair dados da NF\`)
      }`;
    c = c.slice(0, idxIfNf) + newBlock + c.slice(idxIfNf + oldBlock.length);
    console.log('OK filtro inserido (indexOf)');
  }
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK final');
