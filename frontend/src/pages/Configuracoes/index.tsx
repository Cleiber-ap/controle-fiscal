import { useState, useEffect } from 'react'
import { empresasAPI } from '../../api/endpoints'
import { registrarLog } from '../../api/auditoria'

const API = 'http://localhost:8000'
const token = () => localStorage.getItem('access_token')
const hdr = () => ({ 'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json' })

export default function Configuracoes() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [editEmp, setEditEmp] = useState<Record<number, any>>({})
  const [salvandoEmp, setSalvandoEmp] = useState<number | null>(null)
  const [periodoMeses, setPeriodoMeses] = useState(() => parseInt(localStorage.getItem('periodoMeses') || '6'))
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [salvandoSenha, setSalvandoSenha] = useState(false)
  const [notif, setNotif] = useState<{msg: string, ok: boolean} | null>(null)
  const usuarioStr = localStorage.getItem('usuario')
  const usuario = usuarioStr ? JSON.parse(usuarioStr) : null

  const showNotif = (msg: string, ok = true) => {
    setNotif({ msg, ok })
    setTimeout(() => setNotif(null), 3500)
  }

  useEffect(() => {
    empresasAPI.listar().then((r: any) => {
      setEmpresas(r.data)
      const e: Record<number, any> = {}
      r.data.forEach((emp: any) => {
        e[emp.id] = {
          nome: emp.nome,
          razao_social: emp.razao_social,
          aliquota_das: (emp.aliquota_das * 100).toFixed(4),
          credito_icms: (emp.credito_icms * 100).toFixed(4),
        }
      })
      setEditEmp(e)
    }).catch(() => showNotif('Erro ao carregar empresas', false))
  }, [])

  const salvarEmpresa = async (id: number) => {
    setSalvandoEmp(id)
    const d = editEmp[id]
    const payload = {
      nome: d.nome,
      razao_social: d.razao_social,
      aliquota_das: parseFloat(d.aliquota_das.replace(',', '.')) / 100,
      credito_icms: parseFloat(d.credito_icms.replace(',', '.')) / 100,
    }
    try {
      await empresasAPI.atualizar(id, payload)
      await registrarLog({ acao: 'EDITAR', modulo: 'configuracoes', descricao: 'Empresa ' + d.nome + ' atualizada' })
      showNotif('Empresa ' + d.nome + ' salva com sucesso!')
    } catch { showNotif('Erro ao salvar empresa', false) }
    setSalvandoEmp(null)
  }

  const salvarPeriodo = (v: number) => {
    setPeriodoMeses(v)
    localStorage.setItem('periodoMeses', String(v))
    showNotif('Período atualizado para ' + v + ' meses')
  }

  const salvarSenha = async () => {
    if (!novaSenha || novaSenha !== confirmarSenha) { showNotif('Senhas não conferem', false); return }
    if (novaSenha.length < 6) { showNotif('Nova senha deve ter ao menos 6 caracteres', false); return }
    setSalvandoSenha(true)
    try {
      const r = await fetch(API + '/usuarios/' + usuario?.id + '/senha', {
        method: 'PUT', headers: hdr(),
        body: JSON.stringify({ senha_atual: senhaAtual, nova_senha: novaSenha })
      })
      const d = await r.json()
      if (!r.ok) { showNotif(d.detail || 'Erro ao alterar senha', false); return }
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('')
      await registrarLog({ acao: 'EDITAR', modulo: 'configuracoes', descricao: 'Senha alterada' })
      showNotif('Senha alterada com sucesso!')
    } catch { showNotif('Erro ao alterar senha', false) }
    setSalvandoSenha(false)
  }

  const st = {
    card: { background: '#13151F', border: '1px solid #252836', borderRadius: 10, padding: '24px', marginBottom: 24 } as any,
    label: { fontSize: 11, fontWeight: 600, color: '#7B82A0', textTransform: 'uppercase' as any, letterSpacing: '0.08em', marginBottom: 6 },
    input: { background: '#0E1017', border: '1px solid #2A2D3E', borderRadius: 6, color: '#E8EAF0', padding: '8px 12px', fontSize: 13, width: '100%', outline: 'none' } as any,
    btn: (cor = '#4F8EF7') => ({ background: cor, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }) as any,
    secTitle: { fontSize: 13, fontWeight: 700, color: '#E8EAF0', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 } as any,
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 860, color: '#E8EAF0' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, color: '#E8EAF0' }}>⚙️ Configurações</h2>

      {notif && (
        <div style={{ background: notif.ok ? '#0D3326' : '#2D1B1B', border: '1px solid ' + (notif.ok ? '#34D399' : '#F87171'), borderRadius: 8, padding: '12px 18px', marginBottom: 20, color: notif.ok ? '#34D399' : '#F87171', fontSize: 13 }}>
          {notif.msg}
        </div>
      )}

      {/* EMPRESAS */}
      {empresas.map(emp => (
        <div key={emp.id} style={st.card}>
          <div style={st.secTitle}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: emp.id === 1 ? '#4F8EF7' : '#34D399', display: 'inline-block' }} />
            {emp.razao_social}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <div style={st.label}>Nome</div>
              <input style={st.input} value={editEmp[emp.id]?.nome || ''} onChange={e => setEditEmp(p => ({ ...p, [emp.id]: { ...p[emp.id], nome: e.target.value } }))} />
            </div>
            <div>
              <div style={st.label}>Razão Social</div>
              <input style={st.input} value={editEmp[emp.id]?.razao_social || ''} onChange={e => setEditEmp(p => ({ ...p, [emp.id]: { ...p[emp.id], razao_social: e.target.value } }))} />
            </div>
            <div>
              <div style={st.label}>Alíquota DAS (%)</div>
              <input style={st.input} value={editEmp[emp.id]?.aliquota_das || ''} onChange={e => setEditEmp(p => ({ ...p, [emp.id]: { ...p[emp.id], aliquota_das: e.target.value } }))} />
            </div>
            <div>
              <div style={st.label}>Crédito ICMS (%)</div>
              <input style={st.input} value={editEmp[emp.id]?.credito_icms || ''} onChange={e => setEditEmp(p => ({ ...p, [emp.id]: { ...p[emp.id], credito_icms: e.target.value } }))} />
            </div>
          </div>
          <button style={st.btn(emp.id === 1 ? '#4F8EF7' : '#34D399')} onClick={() => salvarEmpresa(emp.id)} disabled={salvandoEmp === emp.id}>
            {salvandoEmp === emp.id ? 'Salvando...' : '💾 Salvar ' + (editEmp[emp.id]?.nome || emp.nome)}
          </button>
        </div>
      ))}

      {/* PERIODO */}
      <div style={st.card}>
        <div style={st.secTitle}>📅 Período de Exibição das NFs</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[3, 4, 6, 12].map(v => (
            <button key={v} onClick={() => salvarPeriodo(v)}
              style={{ ...st.btn(periodoMeses === v ? '#FBBF24' : '#1A1D2A'), border: '1px solid ' + (periodoMeses === v ? '#FBBF24' : '#2A2D3E'), color: periodoMeses === v ? '#000' : '#7B82A0' }}>
              {v} meses
            </button>
          ))}
          <span style={{ fontSize: 12, color: '#7B82A0' }}>Atual: <b style={{ color: '#E8EAF0' }}>{periodoMeses} meses</b></span>
        </div>
      </div>

      {/* SENHA */}
      <div style={st.card}>
        <div style={st.secTitle}>🔒 Alterar Senha — {usuario?.nome || 'Usuário'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={st.label}>Senha Atual</div>
            <input type="password" style={st.input} value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <div style={st.label}>Nova Senha</div>
            <input type="password" style={st.input} value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="••••••••" />
          </div>
          <div>
            <div style={st.label}>Confirmar Nova Senha</div>
            <input type="password" style={st.input} value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="••••••••" />
          </div>
        </div>
        <button style={st.btn('#9333EA')} onClick={salvarSenha} disabled={salvandoSenha}>
          {salvandoSenha ? 'Salvando...' : '🔒 Alterar Senha'}
        </button>
      </div>
    </div>
  )
}
