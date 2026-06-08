// Helper de permissões
export function getUsuario() {
  const s = localStorage.getItem('usuario')
  return s ? JSON.parse(s) : null
}

export function temPermissao(modulo: string, acao: 'visualizar' | 'editar' | 'incluir' | 'apagar' = 'visualizar'): boolean {
  const usuario = getUsuario()
  if (!usuario) return false
  if (usuario.perfil === 'Admin') return true
  return usuario.permissoes?.[modulo]?.[acao] === true
}
