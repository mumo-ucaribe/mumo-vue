// src/plugins/axios.js
import axios from 'axios'
import router from '@/router'   // si lo tienes configurado así

// --- Parámetros desde .env ---
const isVueCLI = !!process.env.VUE_APP_API_BASE_URL
const baseURL = isVueCLI
  ? process.env.VUE_APP_API_BASE_URL
  : import.meta.env.VITE_API_BASE_URL

// Creamos la instancia de Axios
const api = axios.create({
  baseURL,
  withCredentials: false, 
})

// Interceptor de petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuesta
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      // token inválido o expirado
      removeAuthToken()
      router.push({ name: 'Login' })
    }
    return Promise.reject(err)
  }
)

// 4) Helpers para gestionar el token
export function setAuthToken(token) {
  localStorage.setItem('authToken', token)
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

export function removeAuthToken() {
  localStorage.removeItem('authToken')
  delete api.defaults.headers.common.Authorization
}

export default api
