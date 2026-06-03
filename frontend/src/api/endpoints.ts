import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const authAPI = {
  login: (email: string, senha: string) => api.post('/auth/login', { email, senha }),
}
export const empresasAPI = {
  listar: () => api.get('/empresas/'),
  criar: (data: any) => api.post('/empresas/', data),
  atualizar: (id: number, data: any) => api.put(`/empresas/${id}`, data),
  excluir: (id: number) => api.delete(`/empresas/${id}`),
}
export const usuariosAPI = {
  listar: () => api.get('/usuarios/'),
  criar: (data: any) => api.post('/usuarios/', data),
  editar: (id: number, data: any) => api.put(`/usuarios/${id}`, data),
  remover: (id: number) => api.delete(`/usuarios/${id}`),
  salvarPermissoes: (id: number, permissoes: any) => api.put(`/usuarios/${id}/permissoes`, { permissoes }),
}
export const historicoAPI = {
  listar: (empresaId: number) => api.get(`/dados/historico/${empresaId}`),
}
export const dasAPI = {
  listar: (empresaId: number) => api.get(`/dados/das/${empresaId}`),
}
export const notasAPI = {
  listar: (empresaId: number) => api.get(`/notas/${empresaId}`),
  importar: (data: any) => api.post('/notas/importar', data),
  atualizarPagamento: (numeroNf: string, data: any) => api.put(`/notas/${numeroNf}`, data),
}
export const auditAPI = {
  listar: () => api.get('/auditoria/'),
}
export default api
