import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usuariosAdaptador } from '../../../infrastructure/adaptadores/usuariosAdaptador'
import { Card } from '../../componentes/ui/Card'
import { Badge } from '../../componentes/ui/Badge'
import type { Rol } from '../../../domain/entidades'

const badgeRol: Record<string, 'secondary' | 'lavender' | 'lilac'> = {
  ADMIN: 'secondary',
  INSTRUCTOR: 'lilac',
  ESTUDIANTE: 'lavender',
}

export default function PaginaAdminUsuarios() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: () => usuariosAdaptador.listar({}),
  })

  const { mutate: cambiarRol, isPending } = useMutation({
    mutationFn: ({ id, rol }: { id: number; rol: Rol }) => usuariosAdaptador.cambiarRol(id, rol),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  return (
    <div>
      <h1 className="text-xl font-bold text-brand-dark mb-6">Usuarios</h1>
      {isLoading ? (
        <p className="text-neutral-text">Cargando...</p>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-dark text-soft-lavender text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Correo</th>
                <th className="px-4 py-3 text-left font-medium">Rol actual</th>
                <th className="px-4 py-3 text-left font-medium">Cambiar rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-soft-lilac/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand-dark">{u.nombre}</td>
                  <td className="px-4 py-3 text-neutral-text">{u.correo}</td>
                  <td className="px-4 py-3">
                    <Badge variant={badgeRol[u.rol] ?? 'lavender'}>{u.rol}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={u.rol}
                      disabled={isPending}
                      onChange={(e) => cambiarRol({ id: u.id, rol: e.target.value as Rol })}
                      className="rounded border border-border bg-white px-2 py-1 text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                      <option value="ESTUDIANTE">ESTUDIANTE</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.usuarios.length && (
            <p className="text-center text-neutral-text text-sm py-8">Sin usuarios</p>
          )}
        </Card>
      )}
    </div>
  )
}
