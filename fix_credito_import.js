const fs = require('fs');
const p = 'C:/projetos/controle-fiscal/frontend/src/pages/ImportarXML/index.tsx';
let c = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');

// 1. Adicionar refNFe e mesEmissao na interface
c = c.split("  refNFe?: string\n}").join(
  "  refNFe?: string\n  mesEmissao?: number\n  anoEmissao?: number\n}"
);

// 2. Extrair mes/ano no parseXML
c = c.split(
  "      nat_op: natOp,\n      status,\n      arquivo,\n      refNFe: refNFe || undefined,\n    }"
).join(
  "      nat_op: natOp,\n      status,\n      arquivo,\n      refNFe: refNFe || undefined,\n      mesEmissao: dataEmissao ? parseInt(dataEmissao.split('/')[1]) : undefined,\n      anoEmissao: dataEmissao ? parseInt(dataEmissao.split('/')[2]) : undefined,\n    }"
);

// 3. Adicionar estado para creditos pendentes
c = c.split(
  "  const [resultado, setResultado] = useState<string | null>(null)"
).join(
  "  const [resultado, setResultado] = useState<string | null>(null)\n" +
  "  const [creditoPendente, setCreditoPendente] = useState<{nota: any, valorOrig: number} | null>(null)"
);

// 4. Logica de deteccao no loop de importacao - apos registrar ajuste de devolucao
const velhoAjuste =
  "          try {\n" +
  "            await api.post('/notas/ajustes', {\n" +
  "              empresa_id: empId, ano: anoOrig, mes: mesOrig,\n" +
  "              valor: notaFinal.valor_nf, nf_devolucao: notaFinal.numero_nf,\n" +
  "              nf_referenciada: nfOrig, chave_ref: chave\n" +
  "            })\n" +
  "          } catch(e) { console.warn('Ajuste devolucao nao registrado', e) }";

const novoAjuste =
  "          try {\n" +
  "            await api.post('/notas/ajustes', {\n" +
  "              empresa_id: empId, ano: anoOrig, mes: mesOrig,\n" +
  "              valor: notaFinal.valor_nf, nf_devolucao: notaFinal.numero_nf,\n" +
  "              nf_referenciada: nfOrig, chave_ref: chave\n" +
  "            })\n" +
  "            // Verificar se devolucao e do mes seguinte ao original\n" +
  "            const mesDevNum = notaFinal.mesEmissao || 0\n" +
  "            const anoDevNum = notaFinal.anoEmissao || 0\n" +
  "            const mesSegOrig = mesOrig === 12 ? 1 : mesOrig + 1\n" +
  "            const anoSegOrig = mesOrig === 12 ? anoOrig + 1 : anoOrig\n" +
  "            if (mesDevNum === mesSegOrig && anoDevNum === anoSegOrig) {\n" +
  "              // Buscar valor da NF original\n" +
  "              let valorOriginal = notaFinal.valor_nf\n" +
  "              try {\n" +
  "                const res = await api.get('/notas/' + empId)\n" +
  "                const orig = res.data.find((n: any) => n.numero_nf === nfOrig)\n" +
  "                if (orig) valorOriginal = orig.valor_nf\n" +
  "              } catch {}\n" +
  "              const criar = window.confirm(\n" +
  "                'A NF ' + notaFinal.numero_nf + ' \u00e9 uma devolu\u00e7\u00e3o da NF ' + nfOrig + ' (R$ ' +\n" +
  "                valorOriginal.toLocaleString('pt-BR', {minimumFractionDigits:2}) + ').\\n\\n' +\n" +
  "                'Deseja criar um Cr\u00e9dito Fiscal para esta devolu\u00e7\u00e3o?'\n" +
  "              )\n" +
  "              if (criar) {\n" +
  "                await api.post('/notas/creditos', {\n" +
  "                  empresa_id: empId,\n" +
  "                  valor_nf_original: valorOriginal,\n" +
  "                  nf_devolucao: notaFinal.numero_nf,\n" +
  "                  nf_referenciada: nfOrig,\n" +
  "                  mes_orig: mesOrig,\n" +
  "                  ano_orig: anoOrig\n" +
  "                })\n" +
  "              }\n" +
  "            }\n" +
  "          } catch(e) { console.warn('Ajuste devolucao nao registrado', e) }";

c = c.split(velhoAjuste).join(novoAjuste);

fs.writeFileSync(p, c, 'utf8');
console.log('OK');
