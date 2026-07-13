import { useQueries } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useMisInscripciones } from '../../../application/hooks/useProgreso'
import { inscripcionesAdaptador } from '../../../infrastructure/adaptadores/progresoAdaptador'
import { Card, CardContent } from '../../componentes/ui/Card'
import { Badge } from '../../componentes/ui/Badge'

export default function PaginaEstudianteMisCursos() {
  const { data: inscripciones, isLoading } = useMisInscripciones()
  const navigate = useNavigate()

  const progresos = useQueries({
    queries: (inscripciones ?? []).map(ins => ({
      queryKey: ['progreso-curso', ins.id_curso],
      queryFn: () => inscripcionesAdaptador.obtenerProgreso(ins.id_curso),
      enabled: !!inscripciones,
    })),
  })

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold text-brand-dark mb-6">Mis cursos</h1>
      {isLoading ? (
        <p className="text-neutral-text">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inscripciones?.map((ins, idx) => {
            const p = progresos[idx]?.data
            const pct = p?.porcentaje ?? 0
            return (
              <Card
                key={ins.id}
                className="flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/app/cursos/${ins.id_curso}`)}
              >
                <div className="aspect-video bg-soft-lilac/50 flex items-center justify-center text-neutral-text text-xs">
                  {ins.curso?.categoria?.nombre ?? 'Curso'}
                </div>
                <CardContent className="flex flex-col flex-1 gap-2">
                  <Badge variant="lavender" className="self-start">{ins.curso?.categoria?.nombre ?? 'General'}</Badge>
                  <h2 className="font-semibold text-brand-dark leading-snug line-clamp-2">{ins.curso?.titulo ?? `Curso #${ins.id_curso}`}</h2>
                  {ins.curso?.nivel && (
                    <Badge variant="secondary" className="self-start">{ins.curso.nivel === 'BASICO' ? 'Básico' : 'Intermedio'}</Badge>
                  )}
                  <div className="mt-auto space-y-1">
                    <div className="flex items-center justify-between text-xs text-neutral-text">
                      <span>{ins.estado === 'COMPLETADA' ? 'Completado' : 'En curso'}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#22c55e' : '#ED932C' }}
                      />
                    </div>
                    {p && (
                      <p className="text-xs text-neutral-text">{p.completados} de {p.total_items} temas</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {(!inscripciones || inscripciones.length === 0) && (
            <p className="col-span-full text-center text-neutral-text py-12">No estás inscrito en ningún curso aún</p>
          )}
        </div>
      )}
    </div>
  )
}
