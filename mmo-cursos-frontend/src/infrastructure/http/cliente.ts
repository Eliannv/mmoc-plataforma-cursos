import axios, { type AxiosInstance } from 'axios'
import { useSessionStore } from '../../application/stores/sessionStore'

// En dev se usa el proxy de Vite (vite.config.ts) que apunta a localhost:3000
// En producción (Docker nginx) la variable VITE_API_BASE_URL apunta al BFF
const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1'

export const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: adjuntar JWT en cada request
httpClient.interceptors.request.use((config) => {
  const token = useSessionStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: manejar 401 → limpiar sesión
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useSessionStore.getState().cerrarSesion()
    }
    return Promise.reject(error)
  }
)

// Helper: desenvolver el sobre { data, message } del backend
export function desEnvolver<T>(respuesta: { data: { data: T; message: string } }): T {
  return respuesta.data.data
}
