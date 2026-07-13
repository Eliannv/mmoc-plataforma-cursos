import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import type { Rol } from '../../domain/entidades'

interface JwtPayload {
  id: number
  nombre: string
  correo: string
  rol: Rol
  exp: number
}

interface SessionState {
  token: string | null
  usuario: { id: number; nombre: string; correo: string; rol: Rol } | null
  iniciarSesion: (token: string) => void
  cerrarSesion: () => void
  estaAutenticado: () => boolean
  tieneRol: (rol: Rol | Rol[]) => boolean
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,

      iniciarSesion: (token: string) => {
        try {
          const payload = jwtDecode<JwtPayload>(token)
          set({
            token,
            usuario: {
              id: payload.id,
              nombre: payload.nombre,
              correo: payload.correo,
              rol: payload.rol,
            },
          })
        } catch {
          set({ token: null, usuario: null })
        }
      },

      cerrarSesion: () => set({ token: null, usuario: null }),

      estaAutenticado: () => {
        const { token } = get()
        if (!token) return false
        try {
          const { exp } = jwtDecode<JwtPayload>(token)
          return exp * 1000 > Date.now()
        } catch {
          return false
        }
      },

      tieneRol: (rol: Rol | Rol[]) => {
        const { usuario } = get()
        if (!usuario) return false
        const roles = Array.isArray(rol) ? rol : [rol]
        return roles.includes(usuario.rol)
      },
    }),
    {
      name: 'mmo-sesion',
      partialize: (state) => ({ token: state.token, usuario: state.usuario }),
    }
  )
)
