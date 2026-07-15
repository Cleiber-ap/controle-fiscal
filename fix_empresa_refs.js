const fs = require('fs');
const path = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(path, 'utf8');

// Linha 307: const isSix = empresa === 'six' - remover
c = c.replace("  const isSix = empresa === 'six'\r\n", "");
c = c.replace("  const isSix = empresa === 'six'\n", "");

// Linha 421: referência a empresa no registrarLog
c = c.replace(
  "valorDepois: { empresa, total: importadas, vendas: notasVenda.length, notas: notas.map(n => n.numero_nf) }",
  "valorDepois: { total: importadas, vendas: notasVenda.length, notas: notas.map(n => n.numero_nf) }"
);

// Linha 330: empresaDetectada não existe em NFParsed - adicionar à interface
c = c.replace(
  "  cnpjEmitente?: string\n  refNFe?: string",
  "  cnpjEmitente?: string\n  empresaDetectada?: string\n  refNFe?: string"
);

// Linha 417: notaFinal não encontrado - verificar contexto
const idx417 = c.indexOf('const empIdHist = notaFinal.empresa_id');
if (idx417 !== -1) {
  // notaFinal já existe nesse contexto - ok
  console.log('empIdHist OK');
}

fs.writeFileSync(path, c, 'utf8');
console.log('OK');
