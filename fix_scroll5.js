const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Localizar o bloco do useEffect de scroll pelo conteúdo único
const idxEffect = c.indexOf('if (scrollParaAguardando && !loading)');
if (idxEffect === -1) { console.log('NAO ENCONTRADO'); process.exit(1); }

// Achar início do useEffect (useEffect(() => {)
const idxStart = c.lastIndexOf('useEffect(() => {', idxEffect);

// Achar fim do useEffect (}, [scrollParaAguardando, loading])
const idxEnd = c.indexOf('}, [scrollParaAguardando, loading])') + '}, [scrollParaAguardando, loading])'.length;

const newEffect = `useEffect(() => {
    if (scrollParaAguardando && !loading) {
      setTimeout(() => {
        // Tentar linha parcial aguardando (id)
        let el = document.getElementById('primeira-aguardando') as HTMLElement
        // Senao buscar primeira célula com texto "aguardando"
        if (!el) {
          const spans = Array.from(document.querySelectorAll('td span'))
          const span = spans.find(s => s.textContent?.trim() === 'aguardando') as HTMLElement
          if (span) el = span.closest('tr') as HTMLElement
        }
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.style.outline = '2px solid #FBBF24'
          setTimeout(() => { if (el) el.style.outline = '' }, 2000)
        }
        setScrollParaAguardando(false)
      }, 600)
    }
  }, [scrollParaAguardando, loading])`;

c = c.slice(0, idxStart) + newEffect + c.slice(idxEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
