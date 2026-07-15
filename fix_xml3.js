const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// Mudar a assinatura de processarArquivos para receber empresaAtual como parâmetro
c = c.replace(
  "  async function processarArquivos(files: FileList) {",
  "  async function processarArquivos(files: FileList, empresaAtual: string = empresa) {"
);

// Usar empresaAtual no filtro em vez de empresa
c = c.replace(
  "        const cnpjEsperado = CNPJ_EMPRESAS[empresa]",
  "        const cnpjEsperado = CNPJ_EMPRESAS[empresaAtual]"
);

// Passar empresa explicitamente nas chamadas
c = c.replace(
  "if (e.dataTransfer.files.length > 0) processarArquivos(e.dataTransfer.files)",
  "if (e.dataTransfer.files.length > 0) processarArquivos(e.dataTransfer.files, empresa)"
);

c = c.replace(
  "if (e.target.files?.length) processarArquivos(e.target.files)",
  "if (e.target.files?.length) processarArquivos(e.target.files, empresa)"
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
console.log('OK');
