import { useEffect, useState } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://diligent-integrity-production-3f98.up.railway.app' })
api.interceptors.request.use(c => {
  const t = localStorage.getItem('access_token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

interface LogEntry {
  id: number
  usuario_nome: string
  acao: string
  modulo: string
  descricao: string
  valor_antes: string | null
  valor_depois: string | null
  created_at: string
}

const ACAO_COR: Record<string, { cor: string; bg: string }> = {
  CRIAR:     { cor: '#34D399', bg: 'rgba(52,211,153,0.15)' },
  EDITAR:    { cor: '#4F8EF7', bg: 'rgba(79,142,247,0.15)' },
  EXCLUIR:   { cor: '#F87171', bg: 'rgba(248,113,113,0.15)' },
  LOGIN:     { cor: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
  LOGOUT:    { cor: '#7B82A0', bg: 'rgba(123,130,160,0.15)' },
  IMPORTAR:  { cor: '#22D3EE', bg: 'rgba(34,211,238,0.15)' },
  CONFIRMAR: { cor: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
  EXPORTAR:  { cor: '#FB923C', bg: 'rgba(251,146,60,0.15)' },
}

const MODULO_ICON: Record<string, string> = {
  usuarios:   '👤',
  empresas:   '🏢',
  notas:      '📄',
  das:        '💰',
  historico:  '📊',
  auth:       '🔐',
  xml:        '📥',
  excel:      '📊',
}

export default function Auditoria() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroAcao, setFiltroAcao] = useState('')
  const [filtroModulo, setFiltroModulo] = useState('')
  const [filtroUsuario, setFiltroUsuario] = useState('')
  const [expandido, setExpandido] = useState<number | null>(null)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    try {
      const res = await api.get('/auditoria/?limite=500')
      setLogs(res.data)
    } catch { } finally { setLoading(false) }
  }

  const logsFiltrados = logs.filter(l => {
    if (filtroAcao && l.acao !== filtroAcao) return false
    if (filtroModulo && l.modulo !== filtroModulo) return false
    if (filtroUsuario && !l.usuario_nome.toLowerCase().includes(filtroUsuario.toLowerCase())) return false
    return true
  })

  const acoes = [...new Set(logs.map(l => l.acao))].sort()
  const modulos = [...new Set(logs.map(l => l.modulo))].sort()

  function parseJSON(s: string | null) {
    if (!s) return null
    try { return JSON.parse(s) } catch { return s }
  }

  function renderDiff(antes: any, depois: any) {
    if (!antes && !depois) return null
    if (typeof antes === 'string' || typeof depois === 'string') {
      return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
          {antes && <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '10px', color: '#F87171', fontWeight: 600, marginBottom: '4px' }}>ANTES</div>
            <pre style={{ background: '#3B1010', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '6px', padding: '8px', fontSize: '11px', color: '#F87171', margin: 0, whiteSpace: 'pre-wrap' as const, wordBreak: 'break-all' as const }}>{typeof antes === 'object' ? JSON.stringify(antes, null, 2) : antes}</pre>
          </div>}
          {depois && <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '10px', color: '#34D399', fontWeight: 600, marginBottom: '4px' }}>DEPOIS</div>
            <pre style={{ background: '#0D3326', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '6px', padding: '8px', fontSize: '11px', color: '#34D399', margin: 0, whiteSpace: 'pre-wrap' as const, wordBreak: 'break-all' as const }}>{typeof depois === 'object' ? JSON.stringify(depois, null, 2) : depois}</pre>
          </div>}
        </div>
      )
    }

    // Objeto — mostrar campos que mudaram
    const allKeys = [...new Set([...Object.keys(antes || {}), ...Object.keys(depois || {})])]
    const mudancas = allKeys.filter(k => JSON.stringify((antes || {})[k]) !== JSON.stringify((depois || {})[k]))

    if (mudancas.length === 0) return <div style={{ fontSize: '11px', color: '#7B82A0' }}>Sem alterações detectadas</div>

    return (
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <thead>
          <tr style={{ background: '#1A1D2A' }}>
            {['Campo', 'De', 'Para'].map(h => (
              <th key={h} style={{ padding: '6px 10px', textAlign: 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4A5070', borderBottom: '1px solid #252836' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mudancas.map(k => (
            <tr key={k}>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #252836', fontWeight: 600, color: '#7B82A0', fontFamily: 'monospace' }}>{k}</td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #252836', color: '#F87171', fontFamily: 'monospace' }}>{JSON.stringify((antes || {})[k]) ?? '—'}</td>
              <td style={{ padding: '6px 10px', borderBottom: '1px solid #252836', color: '#34D399', fontFamily: 'monospace' }}>{JSON.stringify((depois || {})[k]) ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const selectStyle = {
    padding: '6px 10px', background: '#1A1D2A', border: '1px solid #252836',
    borderRadius: '6px', fontSize: '12px', color: '#E8EAF0', outline: 'none',
    fontFamily: 'inherit', cursor: 'pointer',
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4A5070' }}>
          <span>Sistema</span><span style={{ margin: '0 4px' }}>›</span>
          <span style={{ color: '#7B82A0' }}>Log de Auditoria</span>
        </div>
        <button onClick={carregar} style={{ padding: '6px 14px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '6px', color: '#7B82A0', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>
          🔄 Atualizar
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '16px' }}>
        {[
          { label: 'Total de Eventos', valor: logs.length, cor: '#4F8EF7' },
          { label: 'Edições', valor: logs.filter(l => l.acao === 'EDITAR').length, cor: '#4F8EF7' },
          { label: 'Criações', valor: logs.filter(l => l.acao === 'CRIAR').length, cor: '#34D399' },
          { label: 'Exclusões', valor: logs.filter(l => l.acao === 'EXCLUIR').length, cor: '#F87171' },
        ].map((k, i) => (
          <div key={i} style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '14px 18px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: k.cor }} />
            <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '6px' }}>{k.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'monospace', color: k.cor }}>{k.valor}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '12px 16px', marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' as const }}>
        <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070' }}>Filtros</span>
        <select value={filtroAcao} onChange={e => setFiltroAcao(e.target.value)} style={selectStyle}>
          <option value="">Todas as ações</option>
          {acoes.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filtroModulo} onChange={e => setFiltroModulo(e.target.value)} style={selectStyle}>
          <option value="">Todos os módulos</option>
          {modulos.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input
          value={filtroUsuario}
          onChange={e => setFiltroUsuario(e.target.value)}
          placeholder="Buscar usuário..."
          style={{ ...selectStyle, flex: 1, minWidth: '160px' }}
        />
        {(filtroAcao || filtroModulo || filtroUsuario) && (
          <button onClick={() => { setFiltroAcao(''); setFiltroModulo(''); setFiltroUsuario('') }}
            style={{ padding: '6px 12px', background: '#3B1010', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', color: '#F87171', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit' }}>
            Limpar filtros
          </button>
        )}
        <span style={{ fontSize: '11px', color: '#4A5070', marginLeft: 'auto' }}>
          {logsFiltrados.length} evento{logsFiltrados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabela */}
      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7B82A0' }}>Carregando logs...</div>
        ) : logsFiltrados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7B82A0' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Nenhum evento registrado</div>
            <div style={{ fontSize: '11px' }}>Os logs aparecerão aqui conforme o sistema for utilizado</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: '#1A1D2A' }}>
                {['Data/Hora', 'Usuário', 'Ação', 'Módulo', 'Descrição', ''].map((h, i) => (
                  <th key={i} style={{ padding: '9px 14px', textAlign: 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: '#4A5070', borderBottom: '1px solid #252836', whiteSpace: 'nowrap' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logsFiltrados.map(l => {
                const acaoStyle = ACAO_COR[l.acao] || { cor: '#7B82A0', bg: 'rgba(123,130,160,0.15)' }
                const temDetalhes = l.valor_antes || l.valor_depois
                const isExp = expandido === l.id

                return (
                  <>
                    <tr key={l.id} style={{ background: isExp ? 'rgba(79,142,247,0.04)' : 'transparent', cursor: temDetalhes ? 'pointer' : 'default' }}
                      onClick={() => temDetalhes && setExpandido(isExp ? null : l.id)}>
                      <td style={{ padding: '9px 14px', borderBottom: isExp ? 'none' : '1px solid #252836', fontFamily: 'monospace', fontSize: '11px', color: '#7B82A0', whiteSpace: 'nowrap' as const }}>
                        {l.created_at}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: isExp ? 'none' : '1px solid #252836', fontWeight: 600, color: '#E8EAF0' }}>
                        {l.usuario_nome}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: isExp ? 'none' : '1px solid #252836' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '999px', fontSize: '10px', fontWeight: 700, background: acaoStyle.bg, color: acaoStyle.cor }}>
                          {l.acao}
                        </span>
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: isExp ? 'none' : '1px solid #252836', color: '#7B82A0' }}>
                        <span>{MODULO_ICON[l.modulo] || '📌'} {l.modulo}</span>
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: isExp ? 'none' : '1px solid #252836', color: '#7B82A0', maxWidth: '400px' }}>
                        {l.descricao}
                      </td>
                      <td style={{ padding: '9px 14px', borderBottom: isExp ? 'none' : '1px solid #252836', textAlign: 'center' }}>
                        {temDetalhes && (
                          <span style={{ color: '#4A5070', fontSize: '14px' }}>{isExp ? '▲' : '▼'}</span>
                        )}
                      </td>
                    </tr>
                    {isExp && temDetalhes && (
                      <tr key={`${l.id}-det`}>
                        <td colSpan={6} style={{ padding: '12px 16px', borderBottom: '1px solid #252836', background: 'rgba(79,142,247,0.03)' }}>
                          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#4A5070', marginBottom: '8px' }}>
                            Detalhes da alteração
                          </div>
                          {renderDiff(parseJSON(l.valor_antes), parseJSON(l.valor_depois))}
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
