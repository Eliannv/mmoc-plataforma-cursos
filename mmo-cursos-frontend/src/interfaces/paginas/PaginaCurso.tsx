import { useParams, useNavigate } from 'react-router-dom'
import { Clock, BarChart3, BookOpen, FileText, Monitor, HelpCircle, Play, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useCursoPublico } from '../../application/hooks/useCursos'
import { useSessionStore } from '../../application/stores/sessionStore'
import { Card, CardContent } from '../componentes/ui/Card'
import { Badge } from '../componentes/ui/Badge'
import { Button } from '../componentes/ui/Button'
import type { TipoItem } from '../../domain/entidades'

const iconoItem: Record<TipoItem, React.ReactNode> = {
  VIDEO: <Play size={14} />,
  DOCUMENTO: <FileText size={14} />,
  ACTIVIDAD_INTERACTIVA: <Monitor size={14} />,
  QUIZ: <HelpCircle size={14} />,
}

const labelItem: Record<TipoItem, string> = {
  VIDEO: 'Video',
  DOCUMENTO: 'Documento',
  ACTIVIDAD_INTERACTIVA: 'Actividad',
  QUIZ: 'Quiz',
}

export default function PaginaCurso() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { estaAutenticado } = useSessionStore()
  const cursoId = Number(id)
  const { data: curso, isLoading, isError } = useCursoPublico(cursoId)
  const [seccionAbierta, setSeccionAbierta] = useState<number | null>(null)

  const totalLecciones = (curso?.secciones ?? []).reduce(
    (acc, s) => acc + (s.items ?? []).length, 0
  )

  function handleCta() {
    if (!estaAutenticado()) {
      navigate(`/login?redirect=/cursos/${cursoId}`)
    } else {
      navigate(`/app/cursos/${cursoId}`)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-40 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (isError || !curso) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-brand-dark mb-2">Curso no disponible</h1>
        <p className="text-neutral-text text-sm mb-6">Este curso no existe o aún no ha sido publicado.</p>
        <Button variant="primary" onClick={() => navigate('/')}>Volver al inicio</Button>
      </div>
    )
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-dark via-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-16">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {curso.categoria && (
                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                  {curso.categoria.nombre}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-3">{curso.titulo}</h1>
            {curso.descripcion && (
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                {curso.descripcion}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70 mb-6">
              <span className="flex items-center gap-1.5">
                <BarChart3 size={15} />
                {curso.nivel === 'BASICO' ? 'Básico' : 'Intermedio'}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={15} />
                {totalLecciones} lecciones
              </span>
              {curso.duracion_total_minutos != null && (
                <span className="flex items-center gap-1.5">
                  <Clock size={15} />
                  {curso.duracion_total_minutos} min
                </span>
              )}
            </div>
            <Button variant="accent" size="lg" onClick={handleCta}>
              {estaAutenticado() ? 'Ir al curso' : 'Inscribirme gratis'}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Acerca de */}
            {curso.descripcion && (
              <section>
                <h2 className="text-lg font-bold text-brand-dark mb-3">Acerca de este curso</h2>
                <p className="text-sm text-neutral-text leading-relaxed whitespace-pre-line">{curso.descripcion}</p>
              </section>
            )}

            {/* Contenido */}
            {curso.secciones && curso.secciones.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-brand-dark mb-4">Contenido del curso</h2>
                <div className="border border-border rounded-xl overflow-hidden">
                  {curso.secciones.map((seccion, idx) => (
                    <div key={seccion.id} className="border-b border-border last:border-b-0">
                      <button
                        onClick={() => setSeccionAbierta(seccionAbierta === seccion.id ? null : seccion.id)}
                        className="flex items-center justify-between w-full px-4 py-3 bg-soft-lilac/20 hover:bg-soft-lilac/40 transition-colors text-left"
                      >
                        <span className="font-semibold text-sm text-brand-dark">
                          Sección {idx + 1}: {seccion.titulo}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-neutral-text transition-transform shrink-0 ml-2 ${
                            seccionAbierta === seccion.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {seccionAbierta === seccion.id && (
                        <div className="divide-y divide-border">
                          {(seccion.items ?? []).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-text"
                            >
                              <span className="text-primary shrink-0">{iconoItem[item.tipo]}</span>
                              <span className="flex-1">{item.titulo}</span>
                              <Badge variant="outline" className="text-[10px]">{labelItem[item.tipo]}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-soft-lilac to-soft-lavender flex items-center justify-center">
                  <span className="text-6xl text-primary/60">📺</span>
                </div>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-brand-dark">Gratis</p>
                  </div>
                  <Button variant="accent" size="lg" className="w-full" onClick={handleCta}>
                    {estaAutenticado() ? 'Ir al curso' : 'Inscribirme gratis'}
                  </Button>
                  <div className="space-y-2 text-sm text-neutral-text">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><BarChart3 size={14} />Nivel</span>
                      <span className="font-medium text-brand-dark">{curso.nivel === 'BASICO' ? 'Básico' : 'Intermedio'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><BookOpen size={14} />Lecciones</span>
                      <span className="font-medium text-brand-dark">{totalLecciones}</span>
                    </div>
                    {curso.duracion_total_minutos != null && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Clock size={14} />Duración</span>
                        <span className="font-medium text-brand-dark">{curso.duracion_total_minutos} min</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 z-10">
        <Button variant="accent" size="lg" className="w-full" onClick={handleCta}>
          {estaAutenticado() ? 'Ir al curso' : 'Inscribirme gratis'}
        </Button>
      </div>
    </div>
  )
}
