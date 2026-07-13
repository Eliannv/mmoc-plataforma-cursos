import { useState } from 'react'
import { useCategorias, useCrearCategoria, useEliminarCategoria } from '../../../application/hooks/useCursos'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent } from '../../componentes/ui/Card'
import { Input, Label, InputError } from '../../componentes/ui/Input'
import { Button } from '../../componentes/ui/Button'

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  descripcion: z.string().optional(),
})

export default function PaginaAdminCategorias() {
  const { data: categorias, isLoading } = useCategorias()
  const { mutate: crear, isPending: creando } = useCrearCategoria()
  const { mutate: eliminar } = useEliminarCategoria()
  const [mostrarForm, setMostrarForm] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: z.output<typeof schema>) {
    crear(data, { onSuccess: () => { reset(); setMostrarForm(false) } })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-brand-dark">Categorías</h1>
        <Button
          variant={mostrarForm ? 'ghost' : 'primary'}
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? 'Cancelar' : '+ Nueva categoría'}
        </Button>
      </div>

      {mostrarForm && (
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label htmlFor="nombre">Nombre de la categoría</Label>
                <Input id="nombre" placeholder="Ej: Alfarería" {...register('nombre')} />
                <InputError>{errors.nombre?.message}</InputError>
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción (opcional)</Label>
                <Input id="descripcion" placeholder="Breve descripción" {...register('descripcion')} />
              </div>
              <Button type="submit" disabled={creando}>
                {creando ? 'Guardando...' : 'Crear categoría'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <p className="text-neutral-text">Cargando...</p>
      ) : (
        <Card className="divide-y divide-border">
          {categorias?.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-5 py-3 hover:bg-soft-lilac/20 transition-colors">
              <div>
                <p className="font-medium text-brand-dark text-sm">{cat.nombre}</p>
                {cat.descripcion && <p className="text-neutral-text text-xs">{cat.descripcion}</p>}
              </div>
              <button
                onClick={() => eliminar(cat.id)}
                className="text-error hover:text-error/70 text-xs"
              >
                Eliminar
              </button>
            </div>
          ))}
          {!categorias?.length && (
            <p className="px-5 py-6 text-neutral-text text-sm text-center">Sin categorías</p>
          )}
        </Card>
      )}
    </div>
  )
}
