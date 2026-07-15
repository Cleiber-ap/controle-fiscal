const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// 1. Adicionar contador primeiraAguardandoMarcada antes do map
const mapOld = '{notasFiltradas2.map(r => {';
const mapNew = `{(() => { let primeiraAguardandoMarcada = false; return notasFiltradas2.map(r => {`;
if (!c.includes(mapOld)) { console.log('NAO ENCONTRADO: map'); process.exit(1); }
c = c.replace(mapOld, mapNew);

// 2. Fechar o (() => { ... })() após o map
const mapClose = '</React.Fragment>\n                  )\n                })}\n              </tbody>';
const mapCloseNew = `</React.Fragment>\n                  )\n                })})()}\n              </tbody>`;
if (!c.includes(mapClose)) { console.log('NAO ENCONTRADO: map close'); process.exit(1); }
c = c.replace(mapClose, mapCloseNew);

// 3. Trocar id fixo por lógica condicional na linha prox (aguardando parcial)
c = c.replace(
  '<tr key={r.numero_nf + \'-prox\'} id="primeira-aguardando"',
  '<tr key={r.numero_nf + \'-prox\'} id={!primeiraAguardandoMarcada ? (primeiraAguardandoMarcada = true, "primeira-aguardando") : undefined}'
);

// 4. Também marcar notas Venda sem pagamento como primeira aguardando
// Buscar a td com "aguardando" na linha original
c = c.replace(
  '{isVenda && <span data-aguardando-nf={r.numero_nf} style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>',
  '{isVenda && <span id={!primeiraAguardandoMarcada ? (primeiraAguardandoMarcada = true, "primeira-aguardando") : undefined} style={{ color: \'#4A5070\', fontStyle: \'italic\' }}>aguardando</span>'
);

// 5. Atualizar querySelector para usar getElementById
const idxEffect = c.indexOf('if (scrollParaAguardando && !loading)');
const idxStart = c.lastIndexOf('useEffect(() => {', idxEffect);
const idxEnd = c.indexOf('}, [scrollParaAguardando, loading])') + '}, [scrollParaAguardando, loading])'.length;

const newEffect = `useEffect(() => {
    if (scrollParaAguardando && !loading) {
      setTimeout(() => {
        const el = document.getElementById('primeira-aguardando') as HTMLElement
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          const tr = el.tagName === 'TR' ? el : el.closest('tr') as HTMLElement
          if (tr) {
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
