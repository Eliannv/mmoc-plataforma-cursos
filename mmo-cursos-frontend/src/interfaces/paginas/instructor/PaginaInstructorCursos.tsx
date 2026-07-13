import { useState } from 'react'
import { useCursos, useCrearCurso } from '../../../application/hooks/useCursos'
import { useCategorias } from '../../../application/hooks/useCursos'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { NivelCurso } from '../../../domain/entidades'
import { Card, CardContent } from '../../componentes/ui/Card'
import { Input, Label, InputError } from '../../componentes/ui/Input'
import { Button } from '../../componentes/ui/Button'
import { Badge } from '../../componentes/ui/Badge'

const schema = z.object({
  titulo: z.string().min(3, 'Mínimo 3 caracteres'),
  descripcion: z.string().optional(),
  nivel: z.enum(['BASICO', 'INTERMEDIO']),
  id_categoria: z.coerce.number().min(1, 'Selecciona una categoría'),
})

export default function PaginaInstructorCursos() {
  const { data: cursos, isLoading } = useCursos()
  const { data: categorias } = useCategorias()
  const { mutate: crear, isPending: creando } = useCrearCurso()
  const navigate = useNavigate()
  const [mostrarForm, setMostrarForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nivel: 'BASICO' },
  })

  function onSubmit(data: z.output<typeof schema>) {
    crear({ ...data, nivel: data.nivel as NivelCurso }, {
      onSuccess: (curso) => { reset(); setMostrarForm(false); navigate(`/instructor/cursos/${curso.id}/editar`) },
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-brand-dark">Mis cursos</h1>
        <Button
          variant={mostrarForm ? 'ghost' : 'primary'}
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo curso'}
        </Button>
      </div>

      {mostrarForm && (
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label htmlFor="titulo">Título del curso</Label>
                <Input id="titulo" placeholder="Ej: Introducción a la alfarería" {...register('titulo')} />
                <InputError>{errors.titulo?.message}</InputError>
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <textarea
                  id="descripcion"
                  rows={2}
                  className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-brand-dark placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                  {...register('descripcion')}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="nivel">Nivel</Label>
                  <select
                    id="nivel"
                    {...register('nivel')}
                    className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                  >
                    <option value="BASICO">Básico</option>
                    <option value="INTERMEDIO">Intermedio</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Label htmlFor="id_categoria">Categoría</Label>
                  <select
                    id="id_categoria"
                    {...register('id_categoria')}
                    className="flex w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                  >
                    <option value="">Seleccionar...</option>
                    {categorias?.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                  <InputError>{errors.id_categoria?.message}</InputError>
                </div>
              </div>
              <Button type="submit" disabled={creando}>
                {creando ? 'Creando...' : 'Crear y editar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-neutral-text">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cursos?.map((curso) => (
            <Card key={curso.id}>
              <CardContent>
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-semibold text-brand-dark text-sm">{curso.titulo}</h2>
                  <Badge variant={curso.estado === 'PUBLICADO' ? 'secondary' : 'lavender'}>{curso.estado}</Badge>
                </div>
                <p className="text-neutral-text text-xs mb-3 line-clamp-2">{curso.descripcion || 'Sin descripción'}</p>
                <button
                  onClick={() => navigate(`/instructor/cursos/${curso.id}/editar`)}
                  className="text-primary text-xs font-medium hover:underline"
                >
                  Editar estructura →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
