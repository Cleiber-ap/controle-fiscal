const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Remover data-tipo do JSX (não funciona)
c = c.replace(
  '<tr key={r.numero_nf + \'-prox\'} data-tipo="aguardando"',
  '<tr key={r.numero_nf + \'-prox\'}'
);
c = c.replace(
  'data-tipo="aguardando" style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>',
  'style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>'
);

// Substituir o useEffect por uma abordagem baseada em state com nfAlvo
// Quando salvar, guardar o numero_nf da nota salva e após recarregar scrollar para ela
// Mas mais simples: usar um ref na tabela e calcular posição

// Abordagem: adicionar estado nfAlvo e ref na tabela
// Ao salvar, guardar o nf atual
// Após carregar, encontrar o índice da próxima nota aguardando APÓS a nf salva

// Simplificar: apenas usar window.scrollTo para o final da página
// onde ficam as notas mais antigas
const idxEffect = c.indexOf('if (scrollParaAguardando && !loading)');
const idxStart = c.lastIndexOf('useEffect(() => {', idxEffect);
const idxEnd = c.indexOf('}, [scrollParaAguardando, loading])') + '}, [scrollParaAguardando, loading])'.length;

const newEffect = `useEffect(() => {
    if (scrollParaAguardando && !loading) {
      setTimeout(() => {
        // Buscar todas as trs da tabela de notas
        const trs = Array.from(document.querySelectorAll('table tbody tr'))
        // Encontrar a última tr que contém "aguardando" no texto
        let alvo: HTMLElement | null = null
        for (let i = trs.length - 1; i >= 0; i--) {
          const tr = trs[i] as HTMLElement
          if (tr.textContent?.includes('aguardando')) {
            alvo = tr
            break
          }
        }
        if (alvo) {
          alvo.scrollIntoView({ behavior: 'smooth', block: 'center' })
          alvo.style.outline = '2px solid #FBBF24'
          setTimeout(() => { if (alvo) alvo.style.outline = '' }, 2000)
        }
        setScrollParaAguardando(false)
      }, 800)
    }
  }, [scrollParaAguardando, loading])`;

c = c.slice(0, idxStart) + newEffect + c.slice(idxEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
