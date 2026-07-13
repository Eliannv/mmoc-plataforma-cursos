import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCurso } from '../../../application/hooks/useCursos'
import { useMarcarAvance } from '../../../application/hooks/useProgreso'
import { useQuery } from '@tanstack/react-query'
import { inscripcionesAdaptador } from '../../../infrastructure/adaptadores/progresoAdaptador'
import { ChevronLeft, ChevronDown, Check, Menu, X } from 'lucide-react'
import VideoPlayer from '../../componentes/VideoPlayer'
import { Badge } from '../../componentes/ui/Badge'
import { Button } from '../../componentes/ui/Button'
import type { ItemContenido } from '../../../domain/entidades'

const iconoTipo: Record<string, string> = {
  VIDEO: '🎬',
  DOCUMENTO: '📄',
  ACTIVIDAD_INTERACTIVA: '🧩',
  QUIZ: '📝',
}

function ItemIcon({ tipo, completado }: { tipo: string; completado?: boolean }) {
  if (completado) return <Check size={16} className="text-accent shrink-0" />
  return <span className="text-base shrink-0">{iconoTipo[tipo] ?? '📄'}</span>
}

export default function PaginaEstudianteVerCurso() {
  const { id } = useParams<{ id: string }>()
  const idCurso = parseInt(id!)
  const navigate = useNavigate()
  const [sidebarAbierta, setSidebarAbierta] = useState(false)

  const { data: curso, isLoading } = useCurso(idCurso)

  const { data: progreso } = useQuery({
    queryKey: ['progreso-curso', idCurso],
    queryFn: () => inscripcionesAdaptador.obtenerProgreso(idCurso),
    enabled: !!idCurso,
    retry: false,
  })

  const { mutate: marcarAvance } = useMarcarAvance()

  function handleCompletarItem(item: ItemContenido) {
    if (!progreso?.id_inscripcion) return
    marcarAvance({ id_inscripcion: progreso.id_inscripcion, id_item_contenido: item.id })
  }

  function estaCompletado(idItem: number) {
    return progreso?.items?.some((p) => p.id_item_contenido === idItem && p.completado)
  }

  const [itemSeleccionado, setItemSeleccionado] = useState<ItemContenido | null>(null)
  const [seccionAbierta, setSeccionAbierta] = useState<number | null>(null)

  if (isLoading) return <p className="text-neutral-text p-8">Cargando...</p>
  if (!curso) return <p className="text-error p-8">Curso no encontrado</p>

  const sidebar = (
    <div className="space-y-3">
      {curso.secciones?.map((seccion) => (
        <div key={seccion.id} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setSeccionAbierta(seccionAbierta === seccion.id ? null : seccion.id)}
            className="flex items-center justify-between w-full bg-soft-lilac/30 px-4 py-3 text-left"
          >
            <span className="font-semibold text-sm text-brand-dark">{seccion.titulo}</span>
            <ChevronDown size={16} className={`text-neutral-text transition-transform ${seccionAbierta === seccion.id ? 'rotate-180' : ''}`} />
          </button>
          {seccionAbierta === seccion.id && (
            <div className="divide-y divide-border">
              {seccion.items?.map((item) => {
                const completado = estaCompletado(item.id)
                const esActual = itemSeleccionado?.id === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => { setItemSeleccionado(item); setSidebarAbierta(false) }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors ${
                      esActual ? 'bg-soft-lilac' : 'hover:bg-soft-lavender/20'
                    } ${completado ? '' : ''}`}
                  >
                    <ItemIcon tipo={item.tipo} completado={completado} />
                    <span className={`text-sm flex-1 ${completado ? 'text-neutral-text line-through' : 'text-brand-dark'}`}>
                      {item.titulo}
                    </span>
                    {item.tipo === 'QUIZ' && !completado && (
                      <span className="text-xs text-primary font-medium">Quiz</span>
                    )}
                    {item.tipo === 'DOCUMENTO' && (
                      <span className="text-xs text-neutral-text">PDF</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const itemActual = itemSeleccionado ?? curso.secciones?.[0]?.items?.[0] ?? null

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
    <div className="flex gap-6 relative">
      <button
        className="md:hidden fixed bottom-4 right-4 z-20 bg-primary text-white p-3 rounded-full shadow-lg"
        onClick={() => setSidebarAbierta(!sidebarAbierta)}
        aria-label="Contenido del curso"
      >
        {sidebarAbierta ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`md:w-72 shrink-0 ${sidebarAbierta ? 'fixed inset-0 z-10 bg-white p-4 pt-16 overflow-y-auto' : 'hidden md:block'}`}>
        <div className="mb-4">
          <h2 className="font-bold text-brand-dark text-sm mb-1">{curso.titulo}</h2>
          {progreso && (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-border rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${progreso.porcentaje}%` }}
                />
              </div>
              <span className="text-xs text-neutral-text">{progreso.porcentaje}%</span>
            </div>
          )}
        </div>
        {sidebarAbierta && (
          <button
            onClick={() => setSidebarAbierta(false)}
            className="md:hidden text-sm text-primary mb-3 flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Volver al contenido
          </button>
        )}
        {sidebar}
      </div>

      <div className="flex-1 min-w-0">
        {itemActual ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="lavender">{itemActual.tipo}</Badge>
              <span className="text-sm text-neutral-text">
                {curso.secciones?.find((s) => s.items?.some((i) => i.id === itemActual.id))?.titulo}
              </span>
            </div>
            <h1 className="text-xl font-bold text-brand-dark mb-4">{itemActual.titulo}</h1>

            {itemActual.tipo === 'VIDEO' && itemActual.video?.estado_procesamiento === 'LISTO' && progreso && (
              <VideoPlayer
                idItem={itemActual.id}
                idInscripcion={progreso.id_inscripcion}
                onCompletado={() => handleCompletarItem(itemActual)}
              />
            )}

            {itemActual.tipo === 'DOCUMENTO' && itemActual.documento?.storage_key && (
              <div className="space-y-3">
                <a
                  href={`/api/v1/documentos/${itemActual.id}/url-descarga`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                  onClick={() => handleCompletarItem(itemActual)}
                >
                  📄 Descargar documento
                </a>
              </div>
            )}

            {itemActual.tipo === 'QUIZ' && itemActual.quiz && (
              <Button
                variant="accent"
                onClick={() => navigate(`/cursos/${idCurso}/quiz/${itemActual.id}`)}
              >
                {estaCompletado(itemActual.id) ? 'Volver a tomar quiz' : 'Comenzar quiz'}
              </Button>
            )}

            {itemActual.tipo === 'ACTIVIDAD_INTERACTIVA' && (
              <p className="text-neutral-text text-sm">Actividad interactiva — contenido próximamente.</p>
            )}
          </div>
        ) : (
          <p className="text-neutral-text">Selecciona un ítem del menú lateral para empezar.</p>
        )}
      </div>
    </div>
      </div>
  )
}
