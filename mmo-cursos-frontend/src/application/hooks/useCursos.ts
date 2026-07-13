import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cursosAdaptador, categoriasAdaptador, seccionesAdaptador, itemsAdaptador } from '../../infrastructure/adaptadores/cursosAdaptador'
import type { NivelCurso, TipoItem } from '../../domain/entidades'

// ── Claves de caché ───────────────────────────────────────────
export const QUERY_KEYS = {
  categorias: ['categorias'] as const,
  cursos: (params?: object) => ['cursos', params] as const,
  curso: (id: number) => ['curso', id] as const,
  secciones: (idCurso: number) => ['secciones', idCurso] as const,
  items: (idSeccion: number) => ['items', idSeccion] as const,
}

// ── Categorías ─────────────────────────────────────────────────
export function useCategorias() {
  return useQuery({ queryKey: QUERY_KEYS.categorias, queryFn: categoriasAdaptador.listar })
}

export function useCrearCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoriasAdaptador.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categorias }),
  })
}

export function useEliminarCategoria() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriasAdaptador.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categorias }),
  })
}

// ── Cursos ─────────────────────────────────────────────────────
export function useCursos(params?: { id_categoria?: number; estado?: string }) {
  return useQuery({
    queryKey: QUERY_KEYS.cursos(params),
    queryFn: () => cursosAdaptador.listar(params),
  })
}

export function useCurso(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.curso(id),
    queryFn: () => cursosAdaptador.obtener(id),
    enabled: !!id,
  })
}

export function useCursoPublico(id: number) {
  return useQuery({
    queryKey: ['curso-publico', id],
    queryFn: () => cursosAdaptador.obtenerPublico(id),
    enabled: !!id,
  })
}

export function useCursosPublicos(params?: { id_categoria?: number }) {
  return useQuery({
    queryKey: ['cursos-publicos', params],
    queryFn: () => cursosAdaptador.listarPublicos(params),
  })
}

export function useCrearCurso() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cursosAdaptador.crear,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cursos'] }),
  })
}

export function useActualizarCurso() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: Partial<{ titulo: string; descripcion: string; nivel: NivelCurso; id_categoria: number }> }) =>
      cursosAdaptador.actualizar(id, datos),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.curso(id) })
      qc.invalidateQueries({ queryKey: ['cursos'] })
    },
  })
}

export function usePublicarCurso() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cursosAdaptador.publicar(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.curso(id) })
      qc.invalidateQueries({ queryKey: ['cursos'] })
    },
  })
}

export function useDespublicarCurso() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cursosAdaptador.despublicar(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.curso(id) })
      qc.invalidateQueries({ queryKey: ['cursos'] })
    },
  })
}

// ── Secciones ──────────────────────────────────────────────────
export function useSecciones(idCurso: number) {
  return useQuery({
    queryKey: QUERY_KEYS.secciones(idCurso),
    queryFn: () => seccionesAdaptador.listar(idCurso),
    enabled: !!idCurso,
  })
}

export function useCrearSeccion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ idCurso, datos }: { idCurso: number; datos: { titulo: string; orden?: number } }) =>
      seccionesAdaptador.crear(idCurso, datos),
    onSuccess: (seccion) => qc.invalidateQueries({ queryKey: QUERY_KEYS.secciones(seccion.id_curso) }),
  })
}

export function useEliminarSeccion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number; idCurso: number }) =>
      seccionesAdaptador.eliminar(id),
    onSuccess: (_, { idCurso }) => qc.invalidateQueries({ queryKey: QUERY_KEYS.secciones(idCurso) }),
  })
}

// ── Ítems ─────────────────────────────────────────────────────
export function useItems(idSeccion: number) {
  return useQuery({
    queryKey: QUERY_KEYS.items(idSeccion),
    queryFn: () => itemsAdaptador.listar(idSeccion),
    enabled: !!idSeccion,
  })
}

export function useCrearItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ idSeccion, datos }: { idSeccion: number; datos: { titulo: string; tipo: TipoItem; orden?: number } }) =>
      itemsAdaptador.crear(idSeccion, datos),
    onSuccess: (item) => qc.invalidateQueries({ queryKey: QUERY_KEYS.items(item.id_seccion) }),
  })
}

export function useEliminarItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number; idSeccion: number }) =>
      itemsAdaptador.eliminar(id),
    onSuccess: (_, { idSeccion }) => qc.invalidateQueries({ queryKey: QUERY_KEYS.items(idSeccion) }),
  })
}
