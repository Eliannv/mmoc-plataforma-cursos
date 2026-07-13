import { useMutation } from '@tanstack/react-query'
import { authAdaptador } from '../../infrastructure/adaptadores/authAdaptador'
import { useSessionStore } from '../stores/sessionStore'

export function useLogin() {
  const { iniciarSesion } = useSessionStore()

  return useMutation({
    mutationFn: ({ correo, contrasena }: { correo: string; contrasena: string }) =>
      authAdaptador.login(correo, contrasena),
    onSuccess: (data) => {
      iniciarSesion(data.token)
    },
  })
}

export function useRegistro() {
  return useMutation({
    mutationFn: authAdaptador.registro,
  })
}
