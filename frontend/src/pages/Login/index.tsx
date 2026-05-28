import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    try {
      const res = await axios.post('http://localhost:8000/auth/login', {
        email,
        senha,
      })
      localStorage.setItem('access_token', res.data.access_token)
      localStorage.setItem('usuario', JSON.stringify({
        id: res.data.usuario_id,
        nome: res.data.nome,
        perfil: res.data.perfil,
        permissoes: res.data.permissoes,
      }))
      navigate('/dashboard')
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D0F17',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#13161F',
        border: '1px solid #252836',
        borderRadius: '14px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
      }}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #4F8EF7, #34D399)',
            borderRadius: '12px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 700,
            color: '#0D0F17',
          }}>CF</div>
          <h1 style={{fontSize: '20px', fontWeight: 700, color: '#E8EAF0'}}>
            Controle Fiscal
          </h1>
          <p style={{fontSize: '13px', color: '#7B82A0', marginTop: '4px'}}>
            Faça login para continuar
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{marginBottom: '16px'}}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#7B82A0',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '6px',
            }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@empresa.com"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#1A1D2A',
                border: '1px solid #252836',
                borderRadius: '8px',
                color: '#E8EAF0',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{marginBottom: '24px'}}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#7B82A0',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '6px',
            }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="senha"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#1A1D2A',
                border: '1px solid #252836',
                borderRadius: '8px',
                color: '#E8EAF0',
                fontSize: '13px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {erro && (
            <div style={{
              padding: '10px 14px',
              background: '#3B1010',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: '8px',
              color: '#F87171',
              fontSize: '12px',
              marginBottom: '16px',
            }}>
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4F8EF7',
              border: 'none',
              borderRadius: '8px',
              color: '#0D0F17',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
