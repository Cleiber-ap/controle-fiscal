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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/inicio" element={<Layout><Inicio /></Layout>} />
      <Route path="/impostos" element={<Layout><ImpostosPagos /></Layout>} />
      <Route path="/faturamentos" element={<Layout><Faturamentos /></Layout>} />
      <Route path="/contabilidade" element={<Layout><Contabilidade /></Layout>} />
      <Route path="/xml" element={<Layout><ImportarXML /></Layout>} />
      <Route path="/exportar" element={<Layout><ExportarExcel /></Layout>} />
      <Route path="/relatorios" element={<Layout><Relatorios /></Layout>} />
      <Route path="/empresas" element={<Layout><Empresas /></Layout>} />
      <Route path="/usuarios" element={<Layout><Usuarios /></Layout>} />
      <Route path="/encargos" element={<Layout><Encargos /></Layout>} />
          <Route path="/configuracoes" element={<Layout><Configuracoes /></Layout>} />
          <Route path="/auditoria" element={<Layout><Auditoria /></Layout>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
