const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', 'utf8');

// No bloco CCE/CAN, extrair o CNPJ do emitente e retornar no objeto
// O CNPJ está em <infEvento><CNPJ> no XML de CCE/CAN

// Buscar o return do bloco CCE/CAN
const oldReturn = "      return {\r\n        numero_nf: nNF + (isCCE ? '-CCE' : '-CAN'),\r\n        destinatario: isCCE ? 'CORRECAO: ' + xJust : 'CANCELAMENTO: ' + xJust,\r\n        cnpj_dest: '_lookup_' + nNF,\r\n        valor_nf: 0,\r\n        data_emissao: dataEvento,\r\n        nat_op: isCCE ? 'Carta de Correcao' : 'Cancelamento',\r\n        status: isCCE ? 'Carta de Correcao' : 'Cancelamento',\r\n        arquivo,\r\n      }";

const newReturn = `      // Extrair CNPJ emitente do CCE/CAN via regex
      const cnpjCceMatch = texto.match(/<CNPJ>(\\d+)<\\/CNPJ>/)
      const cnpjEmitenteCce = cnpjCceMatch ? cnpjCceMatch[1] : ''
      return {
        numero_nf: nNF + (isCCE ? '-CCE' : '-CAN'),
        destinatario: isCCE ? 'CORRECAO: ' + xJust : 'CANCELAMENTO: ' + xJust,
        cnpj_dest: '_lookup_' + nNF,
        valor_nf: 0,
        data_emissao: dataEvento,
        nat_op: isCCE ? 'Carta de Correcao' : 'Cancelamento',
        status: isCCE ? 'Carta de Correcao' : 'Cancelamento',
        arquivo,
        cnpjEmitente: cnpjEmitenteCce,
      }`;

if (!c.includes(oldReturn)) {
  // Tentar sem \r\n
  const oldReturn2 = "      return {\n        numero_nf: nNF + (isCCE ? '-CCE' : '-CAN'),\n        destinatario: isCCE ? 'CORRECAO: ' + xJust : 'CANCELAMENTO: ' + xJust,\n        cnpj_dest: '_lookup_' + nNF,\n        valor_nf: 0,\n        data_emissao: dataEvento,\n        nat_op: isCCE ? 'Carta de Correcao' : 'Cancelamento',\n        status: isCCE ? 'Carta de Correcao' : 'Cancelamento',\n        arquivo,\n      }";
  if (c.includes(oldReturn2)) {
    c = c.replace(oldReturn2, newReturn);
    console.log('OK (LF)');
  } else {
    // Usar indexOf
    const idx = c.indexOf("numero_nf: nNF + (isCCE ? '-CCE' : '-CAN')");
    const retStart = c.lastIndexOf('return {', idx);
    const retEnd = c.indexOf('\n      }', idx) + '\n      }'.length;
    c = c.slice(0, retStart) + newReturn + c.slice(retEnd);
    console.log('OK (indexOf)');
  }
} else {
  c = c.replace(oldReturn, newReturn);
  console.log('OK (CRLF)');
}

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx', c, 'utf8');
