const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// Trocar id único por class em todas as linhas aguardando
c = c.replace(
  'id={!primeiraAguardandoMarcada ? (primeiraAguardandoMarcada = true, "primeira-aguardando") : undefined} style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>',
  'className="linha-aguardando" style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>'
);

c = c.replace(
  'id={!primeiraAguardandoMarcada ? (primeiraAguardandoMarcada = true, "primeira-aguardando") : undefined}',
  'className="linha-aguardando"'
);

// Remover o contador primeiraAguardandoMarcada do map (não precisa mais)
c = c.replace(
  '{(() => { let primeiraAguardandoMarcada = false; return notasFiltradas2.map(r => {',
  '{notasFiltradas2.map(r => {'
);
c = c.replace(
  "</React.Fragment>\r\n                  )\r\n                })})()}\r\n              </tbody>",
  "</React.Fragment>\r\n                  )\r\n                })}\r\n              </tbody>"
);

// Atualizar useEffect para pegar o ÚLTIMO elemento (mais antigo = final da lista decrescente)
const idxEffect = c.indexOf('if (scrollParaAguardando && !loading)');
const idxStart = c.lastIndexOf('useEffect(() => {', idxEffect);
const idxEnd = c.indexOf('}, [scrollParaAguardando, loading])') + '}, [scrollParaAguardando, loading])'.length;

const newEffect = `useEffect(() => {
    if (scrollParaAguardando && !loading) {
      setTimeout(() => {
        const els = Array.from(document.querySelectorAll('.linha-aguardando, tr.linha-aguardando'))
        const el = els[els.length - 1] as HTMLElement  // último = mais antigo (ordem decrescente)
        if (el) {
          const tr = el.tagName === 'TR' ? el : el.closest('tr') as HTMLElement
          if (tr) {
            tr.scrollIntoView({ behavior: 'smooth', block: 'center' })
            tr.style.outline = '2px solid #FBBF24'
            setTimeout(() => { tr.style.outline = '' }, 2000)
          }
        }
        setScrollParaAguardando(false)
      }, 600)
    }
  }, [scrollParaAguardando, loading])`;

c = c.slice(0, idxStart) + newEffect + c.slice(idxEnd);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
