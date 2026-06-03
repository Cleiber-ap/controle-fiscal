import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://diligent-integrity-production-3f98.up.railway.app' })
api.interceptors.request.use(c => {
  const t = localStorage.getItem('access_token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

export type AcaoAuditoria = 'CRIAR' | 'EDITAR' | 'EXCLUIR' | 'LOGIN' | 'LOGOUT' | 'IMPORTAR' | 'CONFIRMAR' | 'EXPORTAR' | 'INCLUIR'

interface LogParams {
  acao: AcaoAuditoria
  modulo: string
  descricao: string
  valorAntes?: Record<string, any> | null
  valorDepois?: Record<string, any> | null
}

export async function registrarLog(params: LogParams) {
  try {
    await api.post('/auditoria/', {
      acao: params.acao,
      modulo: params.modulo,
      descricao: params.descricao,
      valor_antes: params.valorAntes ? JSON.stringify(params.valorAntes) : null,
      valor_depois: params.valorDepois ? JSON.stringify(params.valorDepois) : null,
    })
  } catch {
    // Silencioso — log não deve bloquear a operação principal
  }
}
