const fs = require('fs');
let c = fs.readFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', 'utf8');

// 1. Adicionar estado scrollParaAguardando após salvando
c = c.replace(
  "const [salvando, setSalvando] = useState(false)",
  "const [salvando, setSalvando] = useState(false)\n  const [scrollParaAguardando, setScrollParaAguardando] = useState(false)"
);

// 2. Adicionar useEffect para scroll após carregar
c = c.replace(
  "useEffect(() => { carregarTudo() }, [empresa])",
  `useEffect(() => { carregarTudo() }, [empresa])

  useEffect(() => {
    if (scrollParaAguardando && !loading) {
      setTimeout(() => {
        const el = document.querySelector('[data-aguardando="true"]') as HTMLElement
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setScrollParaAguardando(false)
      }, 300)
    }
  }, [scrollParaAguardando, loading])`
);

// 3. Ativar scroll após salvarPagamento
c = c.replace(
  "await carregarTudo()\n      setEditando(null); setEditVPg(''); setEditDtp(''); setEditMesLct('')",
  "await carregarTudo()\n      setScrollParaAguardando(true)\n      setEditando(null); setEditVPg(''); setEditDtp(''); setEditMesLct('')"
);

// 4. Ativar scroll após salvarPagamentoSaldo
c = c.replace(
  "await carregarTudo()\n      setEditando(null); setEditVPg(''); setEditDtp('')",
  "await carregarTudo()\n      setScrollParaAguardando(true)\n      setEditando(null); setEditVPg(''); setEditDtp('')"
);

// 5. Ativar scroll após editarPagamento
c = c.replace(
  "await carregarTudo()\n      console.log('✅ Recarregado')\n      setEditandoPgto(null)",
  "await carregarTudo()\n      setScrollParaAguardando(true)\n      console.log('✅ Recarregado')\n      setEditandoPgto(null)"
);

// 6. Adicionar data-aguardando na linha "Aguardando" (linha vazia da próxima parcela)
c = c.replace(
  "<tr key={r.numero_nf + '-prox'} style={{ background: 'rgba(248,113,113,0.03)', borderLeft: '3px solid #F87171' }}>",
  "<tr key={r.numero_nf + '-prox'} data-aguardando=\"true\" style={{ background: 'rgba(248,113,113,0.03)', borderLeft: '3px solid #F87171' }}>"
);

// 7. Adicionar data-aguardando nas notas Venda sem pagamento (status aguardando)
c = c.replace(
  "{isVenda && <span style={{ color: '#4A5070', fontStyle: 'italic' }}>aguardando</span>",
  "{isVenda && <span data-aguardando-nf={r.numero_nf} style={{ color: '#4A5070', fontStyle: 'italic' }}>aguardando</span>"
);

// Ajustar querySelector para pegar também notas sem pagamento
c = c.replace(
  'const el = document.querySelector(\'[data-aguardando="true"]\') as HTMLElement',
  'const el = (document.querySelector(\'[data-aguardando="true"]\') || document.querySelector(\'[data-aguardando-nf]\')) as HTMLElement'
);

fs.writeFileSync('C:/projetos/controle-fiscal/frontend/src/pages/Contabilidade/index.tsx', c, 'utf8');
console.log('OK');
