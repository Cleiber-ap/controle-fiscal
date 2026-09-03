import { useEffect, useState, useRef } from 'react'

/**
 * Numero que anima do valor anterior ate o novo, com easing.
 *
 * Estava duplicado byte a byte em Contabilidade, Encargos, Faturamentos e
 * Inicio. Consolidado aqui sem nenhuma alteracao de comportamento.
 */
export default function ContadorAnimado({
  valor,
  cor,
  formatador,
}: {
  valor: number
  cor: string
  formatador: (n: number) => string
}) {
  const [exibido, setExibido] = useState(0)
  const anterior = useRef(0)
  useEffect(() => {
    const inicio = anterior.current
    const fim = valor
    const duracao = 600
    const t0 = performance.now()
    let frameId: number
    const passo = (t: number) => {
      const p = Math.min(1, (t - t0) / duracao)
      const ease = 1 - Math.pow(1 - p, 3)
      setExibido(inicio + (fim - inicio) * ease)
      if (p < 1) frameId = requestAnimationFrame(passo)
      else anterior.current = fim
    }
    frameId = requestAnimationFrame(passo)
    return () => cancelAnimationFrame(frameId)
  }, [valor])
  return <span style={{ color: cor }}>{formatador(exibido)}</span>
}
