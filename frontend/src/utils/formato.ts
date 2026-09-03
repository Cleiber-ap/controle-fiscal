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
