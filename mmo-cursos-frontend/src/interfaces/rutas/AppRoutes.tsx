import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSessionStore } from '../../application/stores/sessionStore'
import type { Rol } from '../../domain/entidades'

// Auth
import PaginaLogin from '../paginas/PaginaLogin'
import PaginaLogout from '../paginas/PaginaLogout'

// Public
import LayoutPublico from '../layouts/LayoutPublico'
import PaginaInicioPublica from '../paginas/publico/PaginaInicioPublica'
import PaginaCurso from '../paginas/PaginaCurso'

// Estudiante
import PaginaEstudianteInicio from '../paginas/estudiante/PaginaEstudianteInicio'
import PaginaEstudianteCatalogo from '../paginas/estudiante/PaginaEstudianteCatalogo'
import PaginaEstudianteVerCurso from '../paginas/estudiante/PaginaEstudianteVerCurso'
import PaginaEstudianteMisCursos from '../paginas/estudiante/PaginaEstudianteMisCursos'
import PaginaEstudianteQuiz from '../paginas/estudiante/PaginaEstudianteQuiz'

// Instructor
import PaginaInstructorCursos from '../paginas/instructor/PaginaInstructorCursos'
import PaginaInstructorEditarCurso from '../paginas/instructor/PaginaInstructorEditarCurso'

// Admin
import PaginaAdminCategorias from '../paginas/admin/PaginaAdminCategorias'
import PaginaAdminUsuarios from '../paginas/admin/PaginaAdminUsuarios'
import PaginaAdminCursos from '../paginas/admin/PaginaAdminCursos'

function GuardRol({ roles, children }: { roles: Rol[]; children: React.ReactNode }) {
  const { estaAutenticado, tieneRol } = useSessionStore()
  if (!estaAutenticado()) return <Navigate to="/login" replace />
  if (!tieneRol(roles)) return <Navigate to="/" replace />
  return <>{children}</>
}

function GuardPublico({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, usuario } = useSessionStore()
  if (estaAutenticado() && usuario) {
    const destinos: Record<Rol, string> = {
      ADMIN: '/admin/categorias',
      INSTRUCTOR: '/instructor/cursos',
      ESTUDIANTE: '/app',
    }
    return <Navigate to={destinos[usuario.rol]} replace />
  }
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<GuardPublico><PaginaLogin /></GuardPublico>} />
      <Route path="/registro" element={<Navigate to="/login?tab=registro" replace />} />
      <Route path="/logout" element={<PaginaLogout />} />

      <Route element={<LayoutPublico />}>
        <Route path="/" element={<GuardPublico><PaginaInicioPublica /></GuardPublico>} />
        <Route path="/cursos/:id" element={<PaginaCurso />} />

        <Route path="/app" element={<GuardRol roles={['ESTUDIANTE', 'INSTRUCTOR', 'ADMIN']}><Outlet /></GuardRol>}>
          <Route index element={<PaginaEstudianteInicio />} />
          <Route path="catalogo" element={<PaginaEstudianteCatalogo />} />
          <Route path="mis-cursos" element={<PaginaEstudianteMisCursos />} />
          <Route path="cursos/:id" element={<PaginaEstudianteVerCurso />} />
          <Route path="cursos/:idCurso/quiz/:idItem" element={<PaginaEstudianteQuiz />} />
        </Route>

        <Route path="/instructor" element={<GuardRol roles={['INSTRUCTOR', 'ADMIN']}><Outlet /></GuardRol>}>
          <Route index element={<Navigate to="cursos" replace />} />
          <Route path="cursos" element={<PaginaInstructorCursos />} />
          <Route path="cursos/:id/editar" element={<PaginaInstructorEditarCurso />} />
        </Route>

        <Route path="/admin" element={<GuardRol roles={['ADMIN']}><Outlet /></GuardRol>}>
          <Route index element={<Navigate to="categorias" replace />} />
          <Route path="categorias" element={<PaginaAdminCategorias />} />
          <Route path="usuarios" element={<PaginaAdminUsuarios />} />
          <Route path="cursos" element={<PaginaAdminCursos />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
