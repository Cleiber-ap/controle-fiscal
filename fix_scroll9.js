const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Trocar className por data-tipo nos elementos aguardando
c = c.replace(
  'className="linha-aguardando" style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>',
  'data-tipo="aguardando" style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>'
);

c = c.replace(
  '<tr key={r.numero_nf + \'-prox\'} className="linha-aguardando"',
  '<tr key={r.numero_nf + \'-prox\'} data-tipo="aguardando"'
);

// Atualizar useEffect para usar data-tipo
const idxEffect = c.indexOf('if (scrollParaAguardando && !loading)');
const idxStart = c.lastIndexOf('useEffect(() => {', idxEffect);
const idxEnd = c.indexOf('}, [scrollParaAguardando, loading])') + '}, [scrollParaAguardando, loading])'.length;

const newEffect = `useEffect(() => {
    if (scrollParaAguardando && !loading) {
      setTimeout(() => {
        const els = Array.from(document.querySelectorAll('[data-tipo="aguardando"]'))
        console.log('Aguardando encontrados:', els.length)
        const el = els[els.length - 1] as HTMLElement
        if (el) {
          const tr = el.tagName === 'TR' ? el : el.closest('tr') as HTMLElement
          if (tr) {
            tr.scrollIntoView({ behavior: 'smooth', block: 'center' })
            tr.style.outline = '2px solid #FBBF24'
            setTimeout(() => { tr.style.outline = '' }, 2000)
          }
        }
        setScrollParaAguardando(false)
      }, 800)
    }
  }, [scrollParaAguardando, loading])`;

c = c.slice(0, idxStart) + newEffect + c.slice(idxEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
