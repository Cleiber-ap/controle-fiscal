/**
 * Nomes de mes — fonte unica.
 *
 * MESES estava duplicado identico em 7 telas e MESES_FULL em 2 (com nomes
 * identicos, sob nomes diferentes). Consolidado aqui; nenhum conteudo mudou.
 *
 * O indice 0 e Janeiro, entao para um mes 1..12 use MESES[mes - 1].
 */
export const MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export const MESES_FULL = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
