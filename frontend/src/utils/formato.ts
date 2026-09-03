/**
 * Formatacao de valores — fonte unica.
 *
 * fmtR existia em 8 telas, em duas versoes: cinco com maximumFractionDigits 2 e
 * tres sem. Sem esse limite o padrao vira 3 casas, entao R$ 1.234,567 aparecia
 * no Dashboard, no Importar XML e em Impostos Pagos e R$ 1.234,57 nas demais.
 * Padronizado em 2 casas, que e o correto para valor em reais.
 */
export function fmtR(v: number) {
  return 'R$ ' + v.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Formata CNPJ (14 digitos) ou CPF (11 digitos). Devolve o valor original se
 * nao tiver nenhum dos dois tamanhos, e um travessao quando vazio.
 *
 * Existia em duas versoes: a da Contabilidade tratava CPF, a do Importar XML
 * mostrava o numero cru nesse caso. Ficou a completa — ha notas emitidas para
 * pessoa fisica.
 */
export function fmtCNPJ(v: string) {
  if (!v) return '—'
  const n = v.replace(/\D/g, '')
  if (n.length === 14) return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  if (n.length === 11) return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  return v
}
