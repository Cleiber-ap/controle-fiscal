const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar refNFe na interface NFParsed
c = c.split(
  "  arquivo: string\n}"
).join(
  "  arquivo: string\n  refNFe?: string\n}"
);

// 2. Extrair refNFe no parseXML (NF normal)
c = c.split(
  "    const natOp = get('natOp')\n"
).join(
  "    const natOp = get('natOp')\n" +
  "    const refNFe = get('refNFe') || ''\n"
);

c = c.split(
  "      nat_op: natOp,\n      status,\n      arquivo,\n    }"
).join(
  "      nat_op: natOp,\n      status,\n      arquivo,\n      refNFe: refNFe || undefined,\n    }"
);

// 3. Registrar ajuste durante importacao
const velhoImportar = "await api.post('/notas/importar', notaFinal)\n        importadas++";
const novoImportar =
  "await api.post('/notas/importar', notaFinal)\n" +
  "        importadas++\n" +
  "        // Se for devolucao com refNFe: registrar ajuste para subtrair do RBT12\n" +
  "        const isDev = (notaFinal.nat_op || '').toLowerCase().includes('devolu')\n" +
  "        if (isDev && notaFinal.refNFe && notaFinal.refNFe.length >= 25) {\n" +
  "          const chave = notaFinal.refNFe\n" +
  "          const anoOrig = parseInt('20' + chave.substring(2, 4))\n" +
  "          const mesOrig = parseInt(chave.substring(4, 6))\n" +
  "          const nfOrig = chave.substring(25, 34).replace(/^0+/, '')\n" +
  "          try {\n" +
  "            await api.post('/notas/ajustes', {\n" +
  "              empresa_id: empId, ano: anoOrig, mes: mesOrig,\n" +
  "              valor: notaFinal.valor_nf, nf_devolucao: notaFinal.numero_nf,\n" +
  "              nf_referenciada: nfOrig, chave_ref: chave\n" +
  "            })\n" +
  "          } catch(e) { console.warn('Ajuste devolucao nao registrado', e) }\n" +
  "        }";

c = c.split(velhoImportar).join(novoImportar);

fs.writeFileSync(p, c, 'utf8');
console.log('XML Import OK');
