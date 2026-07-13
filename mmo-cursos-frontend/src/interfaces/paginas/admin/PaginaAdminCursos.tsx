import { useCursos, usePublicarCurso, useDespublicarCurso } from '../../../application/hooks/useCursos'
import { Card } from '../../componentes/ui/Card'
import { Badge } from '../../componentes/ui/Badge'
import { Button } from '../../componentes/ui/Button'

const badgeEstado: Record<string, 'secondary' | 'lavender' | 'outline'> = {
  PUBLICADO: 'secondary',
  BORRADOR: 'lavender',
  INACTIVO: 'outline',
}

export default function PaginaAdminCursos() {
  const { data: cursos, isLoading } = useCursos()
  const { mutate: publicar, isPending: publicando } = usePublicarCurso()
  const { mutate: despublicar, isPending: despublicando } = useDespublicarCurso()

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-dark mb-6">Gestión de cursos</h1>
      {isLoading ? (
        <p className="text-neutral-text">Cargando...</p>
      ) : (
        <Card className="divide-y divide-border">
          {cursos?.map((curso) => (
            <div key={curso.id} className="flex items-center justify-between px-5 py-3 hover:bg-soft-lilac/20 transition-colors">
              <div className="flex items-center gap-3">
                <p className="font-medium text-brand-dark text-sm">{curso.titulo}</p>
                <Badge variant={badgeEstado[curso.estado] ?? 'outline'}>{curso.estado}</Badge>
              </div>
              <div className="flex gap-2">
                {curso.estado !== 'PUBLICADO' && (
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => publicar(curso.id)}
                    disabled={publicando}
                  >
                    Publicar
                  </Button>
                )}
                {curso.estado === 'PUBLICADO' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => despublicar(curso.id)}
                    disabled={despublicando}
                  >
                    Despublicar
                  </Button>
                )}
              </div>
            </div>
          ))}
          {!cursos?.length && (
            <p className="px-5 py-6 text-neutral-text text-sm text-center">Sin cursos</p>
          )}
        </Card>
      )}
    </div>
  )
}
