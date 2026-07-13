import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSessionStore } from '../../application/stores/sessionStore'

export default function PaginaLogout() {
  const cerrarSesion = useSessionStore((s) => s.cerrarSesion)

  useEffect(() => {
    cerrarSesion()
  }, [])

  return <Navigate to="/" replace />
}
