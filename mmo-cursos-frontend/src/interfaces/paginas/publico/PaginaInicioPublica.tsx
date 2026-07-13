import { Link } from 'react-router-dom'
import { BookOpen, Users, Shield, Target, ChevronRight, Clock, BarChart3 } from 'lucide-react'
import { useCategorias, useCursosPublicos } from '../../../application/hooks/useCursos'
import { Card } from '../../componentes/ui/Card'
import { Badge } from '../../componentes/ui/Badge'
import { Button } from '../../componentes/ui/Button'

const iconoPorId = (id: number) => {
  const icons = [BookOpen, Users, Shield, Target]
  const Icon = icons[id % icons.length]
  return <Icon size={24} className="text-primary" />
}

export default function PaginaInicioPublica() {
  const { data: categorias, isError: catError } = useCategorias()
  const { data: cursos, isError: curError } = useCursosPublicos()

  return (
    <>
      <section className="bg-gradient-to-b from-white to-soft-lilac/20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-brand-dark leading-tight max-w-3xl mx-auto">
            Formación gratuita para la defensa de los derechos de las mujeres
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-text max-w-2xl mx-auto">
            MMO El Oro ofrece cursos diseñados por expertas para empoderar a la comunidad
            con herramientas legales, psicológicas y de acompañamiento.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="accent" size="lg" onClick={() => {
              document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Explorar cursos
              <ChevronRight size={18} className="ml-1" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
              document.getElementById('nosotros')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Conocer más
            </Button>
          </div>
        </div>
      </section>

      <section id="categorias" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Categorías</h2>
          <p className="text-neutral-text text-sm mb-8">Explora nuestros cursos por área temática</p>
          {catError ? (
            <Card className="p-6 text-center">
              <p className="text-neutral-text text-sm">
                <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link> para ver las categorías disponibles.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(categorias ?? []).slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/?categoria=${cat.id}`}
                  className="block p-5 rounded-xl border border-border bg-white hover:border-primary hover:shadow-sm transition-all group"
                >
                  <div className="mb-3">{iconoPorId(cat.id)}</div>
                  <h3 className="font-semibold text-brand-dark group-hover:text-primary transition-colors">{cat.nombre}</h3>
                  {cat.descripcion && (
                    <p className="text-xs text-neutral-text mt-1 line-clamp-2">{cat.descripcion}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="cursos" className="py-12 md:py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Cursos destacados</h2>
          <p className="text-neutral-text text-sm mb-8">Programas diseñados para tu formación</p>
          {curError ? (
            <Card className="p-6 text-center">
              <p className="text-neutral-text text-sm">
                <Link to="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link> para ver el listado completo de cursos.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(cursos ?? []).slice(0, 8).map((curso) => (
                <Link key={curso.id} to={`/cursos/${curso.id}`} className="block">
                  <Card className="p-5 h-full hover:border-primary hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-brand-dark text-sm leading-snug">{curso.titulo}</h3>
                      <Badge variant={curso.nivel === 'BASICO' ? 'secondary' : 'lavender'} className="shrink-0">
                        {curso.nivel}
                      </Badge>
                    </div>
                    {curso.descripcion && (
                      <p className="text-xs text-neutral-text line-clamp-2 mb-3">{curso.descripcion}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-neutral-text">
                      {curso.duracion_total_minutos != null && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {curso.duracion_total_minutos} min
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <BarChart3 size={12} />
                        {curso.estado}
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="nosotros" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Card className="p-8 md:p-12 bg-brand-dark text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Nuestro impacto</h2>
            <p className="text-soft-lavender/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              MMO El Oro es una organización comunitaria que brinda acompañamiento legal, psicológico y social
              a mujeres en situación de violencia. Nuestros cursos gratuitos amplifican este acompañamiento
              llevando conocimiento a más personas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {[
                { numero: '500+', label: 'Mujeres acompañadas' },
                { numero: '12', label: 'Cursos disponibles' },
                { numero: '6', label: 'Años de trayectoria' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-accent">{stat.numero}</p>
                  <p className="text-sm text-soft-lavender/80 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}
