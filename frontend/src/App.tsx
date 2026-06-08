import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Empresas from './pages/Empresas'
import Usuarios from './pages/Usuarios'
import Dashboard from './pages/Dashboard'
import Inicio from './pages/Inicio'
import ImpostosPagos from './pages/ImpostosPagos'
import Faturamentos from './pages/Faturamentos'
import Contabilidade from './pages/Contabilidade'
import ImportarXML from './pages/ImportarXML'
import ExportarExcel from './pages/ExportarExcel'
import Relatorios from './pages/Relatorios'
import Auditoria from './pages/Auditoria'
import Configuracoes from './pages/Configuracoes'
import Encargos from './pages/Encargos'
import Layout from './components/Layout'

function getUsuario() {
  const s = localStorage.getItem('usuario')
  return s ? JSON.parse(s) : null
}

function RotaProtegida({ children, modulo }: { children: React.ReactNode, modulo?: string }) {
  const usuario = getUsuario()
  const token = localStorage.getItem('access_token')

  // Não logado
  if (!token || !usuario) return <Navigate to="/login" replace />

  // Admin acessa tudo
  if (usuario.perfil === 'Admin') return <>{children}</>

  // Sem módulo específico = qualquer usuário logado acessa
  if (!modulo) return <>{children}</>

  // Verifica permissão de visualização
  const perm = usuario.permissoes?.[modulo]
  if (!perm || !perm.visualizar) {
    return (
      <div style={{ padding: 40, color: '#F87171', fontSize: 16 }}>
        🚫 Acesso não autorizado.
      </div>
    )
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Layout><RotaProtegida modulo="dashboard"><Dashboard /></RotaProtegida></Layout>} />
      <Route path="/inicio" element={<Layout><RotaProtegida modulo="inicio"><Inicio /></RotaProtegida></Layout>} />
      <Route path="/impostos" element={<Layout><RotaProtegida modulo="impostos"><ImpostosPagos /></RotaProtegida></Layout>} />
      <Route path="/faturamentos" element={<Layout><RotaProtegida modulo="notas"><Faturamentos /></RotaProtegida></Layout>} />
      <Route path="/contabilidade" element={<Layout><RotaProtegida modulo="contab"><Contabilidade /></RotaProtegida></Layout>} />
      <Route path="/xml" element={<Layout><RotaProtegida modulo="xml"><ImportarXML /></RotaProtegida></Layout>} />
      <Route path="/exportar" element={<Layout><RotaProtegida modulo="exp"><ExportarExcel /></RotaProtegida></Layout>} />
      <Route path="/relatorios" element={<Layout><RotaProtegida modulo="rel"><Relatorios /></RotaProtegida></Layout>} />
      <Route path="/empresas" element={<Layout><RotaProtegida modulo="empresas"><Empresas /></RotaProtegida></Layout>} />
      <Route path="/usuarios" element={<Layout><RotaProtegida modulo="usuarios"><Usuarios /></RotaProtegida></Layout>} />
      <Route path="/encargos" element={<Layout><RotaProtegida modulo="encargos"><Encargos /></RotaProtegida></Layout>} />
      <Route path="/configuracoes" element={<Layout><RotaProtegida><Configuracoes /></RotaProtegida></Layout>} />
      <Route path="/auditoria" element={<Layout><RotaProtegida><Auditoria /></RotaProtegida></Layout>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
export default App
