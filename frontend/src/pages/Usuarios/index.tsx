import { useState, useEffect } from 'react'
import { usuariosAPI } from '../../api/endpoints'
import { registrarLog } from '../../api/auditoria'

interface Permissao {
  visualizar: boolean
  editar: boolean
  incluir: boolean
  apagar: boolean
}

interface Usuario {
  id: number
  nome: string
  email: string
  perfil: string
  ativo: boolean
  permissoes?: Record<string, Permissao>
}

const MODULOS = [
  { id: 'dashboard', nome: 'Dashboard' },
  { id: 'inicio', nome: 'Início' },
  { id: 'notas', nome: 'Faturamentos' },
  { id: 'impostos', nome: 'Impostos Pagos' },
  { id: 'contab', nome: 'Contabilidade' },
  { id: 'rel', nome: 'Relatórios' },
  { id: 'empresas', nome: 'Empresas' },
  { id: 'usuarios', nome: 'Usuários' },
  { id: 'xml', nome: 'Importar XML' },
  { id: 'exp', nome: 'Exportar Excel' },
]

const ACOES = ['visualizar', 'editar', 'incluir', 'apagar'] as const
const ACOES_LABEL: Record<string, string> = {
  visualizar: '👁 Ver',
  editar: '✏️ Editar',
  incluir: '➕ Incluir',
  apagar: '🗑 Apagar',
}

const PERFIS = ['Admin', 'Fiscal', 'Operador', 'Leitura']

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [editando, setEditando] = useState<Usuario | null>(null)
  const [novo, setNovo] = useState(false)
  const [permUsuario, setPermUsuario] = useState<Usuario | null>(null)
  const [form, setForm] = useState({ nome: '', email: '', perfil: 'Fiscal', senha: '' })
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    try {
      const res = await usuariosAPI.listar()
      setUsuarios(res.data)
    } catch {
      setErro('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  function abrirNovo() {
    setForm({ nome: '', email: '', perfil: 'Fiscal', senha: '' })
    setNovo(true)
    setEditando(null)
    setPermUsuario(null)
  }

  function abrirEditar(u: Usuario) {
    setForm({ nome: u.nome, email: u.email, perfil: u.perfil, senha: '' })
    setEditando(u)
    setNovo(false)
    setPermUsuario(null)
  }

  function abrirPermissoes(u: Usuario) {
    setPermUsuario(u)
    setEditando(null)
    setNovo(false)
  }

  async function salvar() {
    setSalvando(true)
    try {
      if (novo) {
        await usuariosAPI.criar(form)
        await registrarLog({ acao: 'CRIAR', modulo: 'usuarios', descricao: `Usuário criado: ${form.nome} (${form.email}) · Perfil: ${form.perfil}`, valorDepois: { nome: form.nome, email: form.email, perfil: form.perfil } })
      } else if (editando) {
        await usuariosAPI.editar(editando.id, form)
        await registrarLog({ acao: 'EDITAR', modulo: 'usuarios', descricao: `Usuário editado: ${form.nome} (${form.email})`, valorAntes: { nome: editando.nome, email: editando.email, perfil: editando.perfil }, valorDepois: { nome: form.nome, email: form.email, perfil: form.perfil } })
      }
      setNovo(false)
      setEditando(null)
      await carregar()
    } catch {
      setErro('Erro ao salvar usuário')
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(id: number) {
    if (!confirm('Remover usuário?')) return
    try {
      await usuariosAPI.remover(id)
      const u = usuarios.find(u => u.id === id)
      await registrarLog({ acao: 'EXCLUIR', modulo: 'usuarios', descricao: `Usuário removido: ${u?.nome} (${u?.email})`, valorAntes: { id, nome: u?.nome, email: u?.email, perfil: u?.perfil } })
      await carregar()
    } catch {
      setErro('Erro ao remover usuário')
    }
  }

  async function salvarPermissoes(uid: number, perms: Record<string, Permissao>) {
    try {
      await usuariosAPI.salvarPermissoes(uid, perms)
      const u = usuarios.find(u => u.id === uid)
      await registrarLog({ acao: 'EDITAR', modulo: 'usuarios', descricao: `Permissões atualizadas: ${u?.nome}`, valorAntes: u?.permissoes || null, valorDepois: perms })
      await carregar()
      setPermUsuario(null)
    } catch {
      setErro('Erro ao salvar permissões')
    }
  }

  const perfilCor: Record<string, string> = {
    Admin: '#4F8EF7',
    Fiscal: '#A78BFA',
    Operador: '#FBBF24',
    Leitura: '#7B82A0',
  }

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#E8EAF0' }}>Cadastro de Usuários</h1>
          <p style={{ fontSize: '12px', color: '#7B82A0', marginTop: '4px' }}>Gerencie acessos e permissões</p>
        </div>
        <button onClick={abrirNovo} style={{ padding: '8px 16px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '8px', color: '#4F8EF7', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          + Novo Usuário
        </button>
      </div>

      {erro && <p style={{ color: '#F87171', marginBottom: '12px' }}>{erro}</p>}
      {loading && <p style={{ color: '#7B82A0' }}>Carregando...</p>}

      {/* Tabela de usuários */}
      <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#1A1D2A' }}>
              {['Nome', 'E-mail', 'Perfil', 'Ações'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: h === 'Ações' ? 'center' : 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#7B82A0', borderBottom: '1px solid #252836' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #252836' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#E8EAF0' }}>{u.nome}</td>
                <td style={{ padding: '12px 16px', color: '#7B82A0', fontSize: '12px' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, background: perfilCor[u.perfil] + '22', color: perfilCor[u.perfil] || '#7B82A0' }}>
                    {u.perfil}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <button onClick={() => abrirEditar(u)} style={{ padding: '4px 10px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '6px', color: '#7B82A0', fontSize: '11px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => abrirPermissoes(u)} style={{ padding: '4px 10px', background: '#2A1A52', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '6px', color: '#A78BFA', fontSize: '11px', cursor: 'pointer' }}>Permissões</button>
                  <button onClick={() => excluir(u.id)} style={{ padding: '4px 10px', background: '#3B1010', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', color: '#F87171', fontSize: '11px', cursor: 'pointer' }}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulário novo/editar */}
      {(novo || editando) && (
        <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#E8EAF0', marginBottom: '16px' }}>
            {novo ? 'Novo Usuário' : `Editar: ${editando?.nome}`}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: 'Nome', key: 'nome', type: 'text', placeholder: 'Nome completo' },
              { label: 'E-mail', key: 'email', type: 'email', placeholder: 'email@empresa.com' },
              { label: 'Senha', key: 'senha', type: 'password', placeholder: novo ? 'Senha' : 'Deixe em branco para manter' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#7B82A0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>{f.label}</label>
                <input
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width: '100%', padding: '8px 12px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '6px', color: '#E8EAF0', fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#7B82A0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Perfil</label>
              <select value={form.perfil} onChange={e => setForm(prev => ({ ...prev, perfil: e.target.value }))}
                style={{ width: '100%', padding: '8px 12px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '6px', color: '#E8EAF0', fontSize: '12px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}>
                {PERFIS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button onClick={salvar} disabled={salvando} style={{ padding: '8px 16px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '6px', color: '#4F8EF7', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={() => { setNovo(false); setEditando(null) }} style={{ padding: '8px 14px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '6px', color: '#7B82A0', fontSize: '12px', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabela de permissões */}
      {permUsuario && (
        <PermissoesPanel usuario={permUsuario} onSalvar={salvarPermissoes} onCancelar={() => setPermUsuario(null)} />
      )}
    </div>
  )
}

function PermissoesPanel({ usuario, onSalvar, onCancelar }: {
  usuario: Usuario
  onSalvar: (uid: number, perms: Record<string, any>) => void
  onCancelar: () => void
}) {
  const [perms, setPerms] = useState<Record<string, Record<string, boolean>>>(() => {
    const base: Record<string, Record<string, boolean>> = {}
    MODULOS.forEach(m => {
      base[m.id] = {
        visualizar: usuario.permissoes?.[m.id]?.visualizar || false,
        editar: usuario.permissoes?.[m.id]?.editar || false,
        incluir: usuario.permissoes?.[m.id]?.incluir || false,
        apagar: usuario.permissoes?.[m.id]?.apagar || false,
      }
    })
    return base
  })

  function toggle(modulo: string, acao: string, val: boolean) {
    setPerms(prev => ({ ...prev, [modulo]: { ...prev[modulo], [acao]: val } }))
  }

  function tudo(val: boolean) {
    const novo: Record<string, Record<string, boolean>> = {}
    MODULOS.forEach(m => {
      novo[m.id] = { visualizar: val, editar: val, incluir: val, apagar: val }
    })
    setPerms(novo)
  }

  return (
    <div style={{ background: '#13161F', border: '1px solid #252836', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', background: '#1A1D2A', borderBottom: '1px solid #252836', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#A78BFA' }}>Permissões — {usuario.nome}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => tudo(true)} style={{ padding: '4px 10px', background: '#0D3326', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '5px', color: '#34D399', fontSize: '11px', cursor: 'pointer' }}>Liberar tudo</button>
          <button onClick={() => tudo(false)} style={{ padding: '4px 10px', background: '#3B1010', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '5px', color: '#F87171', fontSize: '11px', cursor: 'pointer' }}>Bloquear tudo</button>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ background: '#1A1D2A' }}>
              <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#7B82A0', borderBottom: '1px solid #252836' }}>Módulo</th>
              {ACOES.map(a => (
                <th key={a} style={{ padding: '8px 16px', textAlign: 'center', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: '#7B82A0', borderBottom: '1px solid #252836', width: '90px' }}>{ACOES_LABEL[a]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULOS.map(m => (
              <tr key={m.id} style={{ borderBottom: '1px solid #252836' }}>
                <td style={{ padding: '10px 16px', color: '#E8EAF0', fontWeight: 500 }}>{m.nome}</td>
                {ACOES.map(a => (
                  <td key={a} style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={perms[m.id]?.[a] || false}
                      onChange={e => toggle(m.id, a, e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#4F8EF7' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
        <button onClick={() => onSalvar(usuario.id, perms)} style={{ padding: '8px 16px', background: '#1C2E52', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '6px', color: '#4F8EF7', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Salvar Permissões</button>
        <button onClick={onCancelar} style={{ padding: '8px 14px', background: '#1A1D2A', border: '1px solid #252836', borderRadius: '6px', color: '#7B82A0', fontSize: '12px', cursor: 'pointer' }}>Cancelar</button>
      </div>
    </div>
  )
}
