import { useState } from 'react'
import { Outlet, Link, useNavigate, NavLink, useLocation } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { Button } from '../componentes/ui/Button'
import { Badge } from '../componentes/ui/Badge'
import { useSessionStore } from '../../application/stores/sessionStore'
import { useCategorias } from '../../application/hooks/useCursos'
import type { Rol } from '../../domain/entidades'

const badgeRol: Record<Rol, 'secondary' | 'lavender'> = {
  ADMIN: 'secondary',
  INSTRUCTOR: 'secondary',
  ESTUDIANTE: 'lavender',
}

export default function LayoutPublico() {
  const { usuario, estaAutenticado } = useSessionStore()
  const { data: categorias } = useCategorias()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  function handleBuscar(e: React.FormEvent) {
    e.preventDefault()
    if (busqueda.trim()) {
      const destino = estaAutenticado() ? `/app/catalogo?buscar=${encodeURIComponent(busqueda.trim())}` : `/?buscar=${encodeURIComponent(busqueda.trim())}`
      navigate(destino)
    }
  }

  function handleLogout() {
    navigate('/logout', { replace: true })
  }

  const autenticado = estaAutenticado() && usuario
  const { pathname } = useLocation()
  const ocultarSubNav = /^\/(app\/)?cursos\/\d+/.test(pathname)

  const navRoles =
    !autenticado ? [] :
    usuario!.rol === 'ADMIN' ? [
      { label: 'Categorías', to: '/admin/categorias' },
      { label: 'Usuarios', to: '/admin/usuarios' },
      { label: 'Cursos', to: '/admin/cursos' },
    ] : usuario!.rol === 'INSTRUCTOR' ? [
      { label: 'Mis cursos', to: '/instructor/cursos' },
    ] : []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link to={autenticado ? '/app' : '/'} className="font-bold text-lg text-brand-dark shrink-0 tracking-tight">
              MMO Cursos
            </Link>

            <form onSubmit={handleBuscar} className="hidden md:flex flex-1 max-w-md mx-auto relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar cursos por tema..."
                className="w-full rounded-full border border-border bg-muted pl-9 pr-4 py-2 text-sm text-brand-dark placeholder:text-neutral-text focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </form>

            <div className="hidden md:flex items-center gap-2">
              {autenticado ? (
                <>
                  <NavLink to="/app/mis-cursos" className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-brand-dark hover:text-primary'}`
                  }>
                    Mis cursos
                  </NavLink>
                  <span className="text-sm text-brand-dark font-medium">{usuario!.nombre}</span>
                  <Badge variant={badgeRol[usuario!.rol]}>{usuario!.rol}</Badge>
                  <Button variant="outline" size="sm" onClick={handleLogout}>Salir</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                    Iniciar sesión
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => navigate('/login?tab=registro')}>
                    Registrarse
                  </Button>
                </>
              )}
            </div>

            <button
              className="md:hidden text-brand-dark p-1"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Menú"
            >
              {menuAbierto ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {menuAbierto && (
        <div className="md:hidden bg-white border-b border-border px-4 py-4 space-y-3">
          <form onSubmit={(e) => { handleBuscar(e); setMenuAbierto(false) }} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-text" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar cursos por tema..."
              className="w-full rounded-full border border-border bg-muted pl-9 pr-4 py-2 text-sm text-brand-dark placeholder:text-neutral-text focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </form>
          <div className="flex flex-col gap-1">
            {navRoles.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuAbierto(false)}
                className={({ isActive }) =>
                  `text-sm py-2 transition-colors ${isActive ? 'text-primary font-medium' : 'text-brand-dark hover:text-primary'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {autenticado && categorias?.map((c) => (
              <Link
                key={c.id}
                to={`/app/catalogo?id_categoria=${c.id}`}
                onClick={() => setMenuAbierto(false)}
                className="text-sm text-brand-dark hover:text-primary py-2 transition-colors"
              >
                {c.nombre}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            {autenticado ? (
              <div className="flex items-center gap-2 w-full">
                <NavLink to="/app/mis-cursos" onClick={() => setMenuAbierto(false)}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Mis cursos
                </NavLink>
                <span className="text-sm text-brand-dark flex-1">{usuario!.nombre}</span>
                <Badge variant={badgeRol[usuario!.rol]}>{usuario!.rol}</Badge>
                <Button variant="outline" size="sm" onClick={() => { setMenuAbierto(false); handleLogout() }}>
                  Salir
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setMenuAbierto(false); navigate('/login') }}>
                  Iniciar sesión
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => { setMenuAbierto(false); navigate('/login?tab=registro') }}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {!ocultarSubNav && autenticado && (
        <nav className="hidden md:flex border-b border-border bg-muted/50">
          <div className="max-w-6xl mx-auto px-6 flex items-center gap-6 h-10 overflow-x-auto">
            {navRoles.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm shrink-0 transition-colors ${isActive ? 'text-primary font-medium' : 'text-neutral-text hover:text-primary'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {categorias?.map((c) => (
              <Link
                key={c.id}
                to={`/app/catalogo?id_categoria=${c.id}`}
                className="text-sm text-neutral-text hover:text-primary shrink-0 transition-colors"
              >
                {c.nombre}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-dark text-soft-lavender">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-base mb-2">MMO Cursos</h3>
              <p className="text-sm text-soft-lavender/80 leading-relaxed">
                Formación gratuita para el desarrollo personal, comunitario y el fortalecimiento de capacidades. Aprender para crecer, emprender y transformar vidas.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Enlaces</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Cursos', to: autenticado ? '/app/mis-cursos' : '/#cursos' },
                  { label: 'Categorías', to: autenticado ? '/app/catalogo' : '/#categorias' },
                ].map((l) => (
                  <li key={l.label}>
                    {autenticado ? (
                      <Link to={l.to} className="text-sm text-soft-lavender/80 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.to} className="text-sm text-soft-lavender/80 hover:text-white transition-colors">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-3">Contacto</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-soft-lavender/80">contacto@mmoeloro.org</span></li>
                <li><span className="text-sm text-soft-lavender/80">El Oro, México</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary/30 mt-8 pt-6 text-center">
            <p className="text-xs text-soft-lavender/60">
              &copy; {new Date().getFullYear()} MMO El Oro. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
