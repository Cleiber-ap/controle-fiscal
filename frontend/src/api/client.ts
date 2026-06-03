import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://diligent-integrity-production-3f98.up.railway.app',
})

// Interceptor: adiciona o token JWT em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: se receber 401 (não autorizado), redireciona para login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// v2
