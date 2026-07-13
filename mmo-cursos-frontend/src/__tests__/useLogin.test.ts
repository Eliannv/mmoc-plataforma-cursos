import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useLogin } from '../application/hooks/useAuth'

// Mock del adaptador de auth
vi.mock('../infrastructure/adaptadores/authAdaptador', () => ({
  authAdaptador: {
    login: vi.fn(),
    registro: vi.fn(),
    perfil: vi.fn(),
  },
}))

// Mock del store de sesión
vi.mock('../application/stores/sessionStore', () => ({
  useSessionStore: vi.fn(() => ({
    iniciarSesion: vi.fn(),
    cerrarSesion: vi.fn(),
    estaAutenticado: vi.fn(() => false),
    tieneRol: vi.fn(() => false),
    token: null,
    usuario: null,
  })),
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useLogin', () => {
  beforeEach(() => vi.clearAllMocks())

  it('debe llamar al adaptador con correo y contraseña', async () => {
    const { authAdaptador } = await import('../infrastructure/adaptadores/authAdaptador')
    const mockLogin = vi.fn().mockResolvedValue({
      token: 'fake-jwt',
      usuario: { id: 1, nombre: 'Test', correo: 'test@example.com', rol: 'ESTUDIANTE' },
    })
    vi.mocked(authAdaptador.login).mockImplementation(mockLogin)

    const { result } = renderHook(() => useLogin(), { wrapper })

    act(() => {
      result.current.mutate({ correo: 'test@example.com', contrasena: 'password123' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('debe exponer error cuando el login falla', async () => {
    const { authAdaptador } = await import('../infrastructure/adaptadores/authAdaptador')
    vi.mocked(authAdaptador.login).mockRejectedValue(new Error('Credenciales inválidas'))

    const { result } = renderHook(() => useLogin(), { wrapper })

    act(() => {
      result.current.mutate({ correo: 'wrong@email.com', contrasena: 'wrongpass' })
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeTruthy()
  })
})
