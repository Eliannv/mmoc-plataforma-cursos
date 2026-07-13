import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useCurso, useSecciones, useCrearSeccion, useCrearItem, useEliminarSeccion, useEliminarItem } from '../../../application/hooks/useCursos'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import VideoUploader from '../../componentes/VideoUploader'
import DocumentoUploader from '../../componentes/DocumentoUploader'
import { Card, CardContent } from '../../componentes/ui/Card'
import { Input } from '../../componentes/ui/Input'
import { Button } from '../../componentes/ui/Button'
import type { ItemContenido, TipoItem } from '../../../domain/entidades'

function ItemSortable({ item, onEliminar }: { item: ItemContenido; onEliminar: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  const iconos: Record<TipoItem, string> = {
    VIDEO: '🎬',
    DOCUMENTO: '📄',
    ACTIVIDAD_INTERACTIVA: '🧩',
    QUIZ: '📝',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded p-3 flex items-center gap-3 transition-shadow ${
        isDragging ? 'border-primary shadow-md' : 'border-border'
      }`}
    >
      <button {...attributes} {...listeners} className="cursor-grab text-neutral-text hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
        <GripVertical size={16} />
      </button>
      <span className="text-lg">{iconos[item.tipo]}</span>
      <span className="text-sm flex-1 font-medium text-brand-dark">{item.titulo}</span>
      <span className="text-xs text-neutral-text">{item.tipo}</span>
      {item.tipo === 'VIDEO' && <VideoUploader idItem={item.id} video={item.video} />}
      {item.tipo === 'DOCUMENTO' && <DocumentoUploader idItem={item.id} documento={item.documento} />}
      <button onClick={onEliminar} className="text-error hover:text-error/70 text-xs ml-1">✕</button>
    </div>
  )
}

export default function PaginaInstructorEditarCurso() {
  const { id } = useParams<{ id: string }>()
  const idCurso = parseInt(id!)
  const { data: curso } = useCurso(idCurso)
  const { data: secciones, isLoading } = useSecciones(idCurso)
  const { mutate: crearSeccion } = useCrearSeccion()
  const { mutate: crearItem } = useCrearItem()
  const { mutate: eliminarSeccion } = useEliminarSeccion()
  const { mutate: eliminarItem } = useEliminarItem()
  const [nuevaSeccion, setNuevaSeccion] = useState('')
  const [seccionAbierta, setSeccionAbierta] = useState<number | null>(null)
  const [nuevoItem, setNuevoItem] = useState({ titulo: '', tipo: 'VIDEO' as TipoItem })

  function handleCrearSeccion() {
    if (!nuevaSeccion.trim()) return
    crearSeccion({ idCurso, datos: { titulo: nuevaSeccion } }, {
      onSuccess: () => setNuevaSeccion(''),
    })
  }

  function handleCrearItem(idSeccion: number) {
    if (!nuevoItem.titulo.trim()) return
    crearItem({ idSeccion, datos: nuevoItem }, {
      onSuccess: () => setNuevoItem({ titulo: '', tipo: 'VIDEO' }),
    })
  }

  if (isLoading) return <p className="text-neutral-text">Cargando...</p>

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-dark mb-1">{curso?.titulo ?? '...'}</h1>
      <p className="text-neutral-text text-sm mb-6">Editor de estructura — secciones e ítems</p>

      <div className="flex gap-2 mb-6">
        <Input
          value={nuevaSeccion}
          onChange={(e) => setNuevaSeccion(e.target.value)}
          placeholder="Nombre de la sección..."
          onKeyDown={(e) => e.key === 'Enter' && handleCrearSeccion()}
        />
        <Button onClick={handleCrearSeccion}>+ Sección</Button>
      </div>

      <div className="space-y-4">
        {secciones?.map((seccion) => (
          <Card key={seccion.id} className="overflow-hidden">
            <div
              className="bg-soft-lilac/30 px-4 py-3 flex items-center justify-between cursor-pointer"
              onClick={() => setSeccionAbierta(seccionAbierta === seccion.id ? null : seccion.id)}
            >
              <h3 className="font-semibold text-brand-dark text-sm">{seccion.titulo}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-text">{seccionAbierta === seccion.id ? '▲' : '▼'}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); eliminarSeccion({ id: seccion.id, idCurso }) }}
                  className="text-error hover:text-error/70 text-xs"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {seccionAbierta === seccion.id && (
              <CardContent className="space-y-2">
                <div className="space-y-2">
                  <DndContext collisionDetection={closestCenter} onDragEnd={() => {}}>
                    <SortableContext items={seccion.items?.map((i) => i.id) ?? []} strategy={verticalListSortingStrategy}>
                      {seccion.items?.map((item) => (
                        <div key={item.id} className="group">
                          <ItemSortable
                            item={item}
                            onEliminar={() => eliminarItem({ id: item.id, idSeccion: seccion.id })}
                          />
                        </div>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>

                <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                  <Input
                    value={nuevoItem.titulo}
                    onChange={(e) => setNuevoItem({ ...nuevoItem, titulo: e.target.value })}
                    placeholder="Título del ítem..."
                    className="text-xs"
                  />
                  <select
                    value={nuevoItem.tipo}
                    onChange={(e) => setNuevoItem({ ...nuevoItem, tipo: e.target.value as TipoItem })}
                    className="rounded-md border border-border bg-white px-2 py-1.5 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="VIDEO">Video</option>
                    <option value="DOCUMENTO">Documento</option>
                    <option value="ACTIVIDAD_INTERACTIVA">Actividad</option>
                    <option value="QUIZ">Quiz</option>
                  </select>
                  <Button
                    size="sm"
                    onClick={() => handleCrearItem(seccion.id)}
                  >
                    + Agregar
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
