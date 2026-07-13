import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCursos } from '../../../application/hooks/useCursos'
import { useInscribirseACurso } from '../../../application/hooks/useProgreso'
import { Card, CardContent } from '../../componentes/ui/Card'
import { Badge } from '../../componentes/ui/Badge'
import { Button } from '../../componentes/ui/Button'

export default function PaginaEstudianteCatalogo() {
  const [searchParams] = useSearchParams()
  const catSeleccionada = (() => {
    const v = searchParams.get('id_categoria')
    return v ? parseInt(v) : undefined
  })()
  const { data: cursos, isLoading } = useCursos({ id_categoria: catSeleccionada, estado: 'PUBLICADO' })
  const { mutate: inscribirse, isPending: inscribiendo } = useInscribirseACurso()
  const navigate = useNavigate()

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {isLoading ? (
        <p className="text-neutral-text">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cursos?.map((curso) => (
            <Card key={curso.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-soft-lilac/50 flex items-center justify-center text-neutral-text text-xs">
                {curso.categoria?.nombre ?? 'Curso'}
              </div>
              <CardContent className="flex flex-col flex-1 gap-2">
                <Badge variant="lavender" className="self-start">{curso.categoria?.nombre ?? 'General'}</Badge>
                <h2 className="font-semibold text-brand-dark leading-snug line-clamp-2">{curso.titulo}</h2>
                {curso.descripcion && (
                  <p className="text-neutral-text text-sm line-clamp-2">{curso.descripcion}</p>
                )}
                <Badge variant="secondary" className="self-start">{curso.nivel === 'BASICO' ? 'Básico' : 'Intermedio'}</Badge>
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/cursos/${curso.id}`)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    className="flex-1"
                    onClick={() => inscribirse(curso.id, { onSuccess: () => navigate(`/cursos/${curso.id}`) })}
                    disabled={inscribiendo}
                  >
                    Inscribirme
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!cursos?.length && (
            <p className="col-span-full text-center text-neutral-text py-12">No hay cursos publicados en esta categoría</p>
          )}
        </div>
      )}
    </div>
  )
}
