import { Link, useNavigate } from 'react-router-dom'
import { useCursosPublicos } from '../../../application/hooks/useCursos'
import { useMisInscripciones } from '../../../application/hooks/useProgreso'
import { Card, CardContent } from '../../componentes/ui/Card'
import { Badge } from '../../componentes/ui/Badge'
import { Button } from '../../componentes/ui/Button'

export default function PaginaEstudianteInicio() {
  const { data: inscripciones, isLoading: cargandoInscrip } = useMisInscripciones()
  const { data: cursosPublicos } = useCursosPublicos()
  const navigate = useNavigate()

  const idsInscritos = new Set(inscripciones?.map(i => i.id_curso) ?? [])

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-10">
      {/* Mis cursos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-dark">Mis cursos</h2>
          {inscripciones && inscripciones.length > 4 && (
            <Link to="/app/mis-cursos" className="text-sm text-primary hover:underline font-medium">
              Ver todos
            </Link>
          )}
        </div>
        {cargandoInscrip ? (
          <p className="text-neutral-text text-sm">Cargando...</p>
        ) : inscripciones && inscripciones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {inscripciones.slice(0, 4).map((ins) => (
              <Card key={ins.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/app/cursos/${ins.id_curso}`)}>
                <div className="aspect-video bg-soft-lilac/50 flex items-center justify-center text-neutral-text text-xs">
                  {ins.curso?.categoria?.nombre ?? 'Curso'}
                </div>
                <CardContent className="flex flex-col flex-1 gap-2">
                  <h3 className="font-semibold text-brand-dark leading-snug line-clamp-2">{ins.curso?.titulo ?? `Curso #${ins.id_curso}`}</h3>
                  {ins.curso?.nivel && (
                    <Badge variant="secondary" className="self-start">{ins.curso.nivel === 'BASICO' ? 'Básico' : 'Intermedio'}</Badge>
                  )}
                  <span className="text-xs text-neutral-text">
                    {ins.estado === 'ACTIVA' ? 'En curso' : ins.estado === 'COMPLETADA' ? 'Completado' : 'Cancelado'}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted rounded-xl p-8 text-center">
            <p className="text-neutral-text mb-3">No estás inscrito en ningún curso aún</p>
            <Button variant="primary" onClick={() => navigate('/app/catalogo')}>
              Explorar catálogo
            </Button>
          </div>
        )}
      </section>

      {/* Todos los cursos del sistema */}
      <section>
        <h2 className="text-lg font-bold text-brand-dark mb-4">Todos los cursos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(cursosPublicos ?? []).slice(0, 50).map((curso) => {
            const inscrito = idsInscritos.has(curso.id)
            return (
              <Card key={curso.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-soft-lilac/50 flex items-center justify-center text-neutral-text text-xs">
                  {curso.categoria?.nombre ?? 'Curso'}
                </div>
                <CardContent className="flex flex-col flex-1 gap-2">
                  <Badge variant="lavender" className="self-start">{curso.categoria?.nombre ?? 'General'}</Badge>
                  <h3 className="font-semibold text-brand-dark leading-snug line-clamp-2">{curso.titulo}</h3>
                  {curso.descripcion && (
                    <p className="text-neutral-text text-sm line-clamp-2">{curso.descripcion}</p>
                  )}
                  <Badge variant="secondary" className="self-start">{curso.nivel === 'BASICO' ? 'Básico' : 'Intermedio'}</Badge>
                  <div className="flex gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/cursos/${curso.id}`)}>
                      Ver
                    </Button>
                    {!inscrito && (
                      <Button variant="accent" size="sm" className="flex-1" onClick={() => navigate(`/app/catalogo?id_categoria=${curso.id_categoria ?? ''}`)}>
                        Inscribirme
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {(!cursosPublicos || cursosPublicos.length === 0) && (
            <p className="col-span-full text-center text-neutral-text py-12">No hay cursos publicados aún</p>
          )}
        </div>
      </section>
    </div>
  )
}
