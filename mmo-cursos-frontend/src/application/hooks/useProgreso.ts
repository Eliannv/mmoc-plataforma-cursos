import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inscripcionesAdaptador, progresoAdaptador, intentosAdaptador } from '../../infrastructure/adaptadores/progresoAdaptador'
import { useRef } from 'react'
import type { RespuestaIntento } from '../../domain/entidades'

export function useInscribirseACurso() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (idCurso: number) => inscripcionesAdaptador.inscribirse(idCurso),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mis-inscripciones'] }),
  })
}

export function useMisInscripciones() {
  return useQuery({
    queryKey: ['mis-inscripciones'],
    queryFn: inscripcionesAdaptador.listarMias,
  })
}

export function useProgresoDelCurso(idCurso: number) {
  return useQuery({
    queryKey: ['progreso-curso', idCurso],
    queryFn: () => inscripcionesAdaptador.obtenerProgreso(idCurso),
    enabled: !!idCurso,
  })
}

export function useMarcarAvance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: progresoAdaptador.marcarAvance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['progreso-curso'] })
    },
  })
}

// Hook para hacer tracking throttled de segundos vistos
// El frontend llama a reportarSegundos() cada X segundos; el hook
// agrupa y envía al backend con throttling (mín 10s entre envíos)
export function useTrackingVideo(idInscripcion: number, idItem: number) {
  const { mutate: marcar } = useMarcarAvance()
  const ultimoEnvioRef = useRef<number>(0)
  const THROTTLE_MS = 10_000 // cada 10 segundos como mínimo

  const reportarSegundos = (segundosVistos: number) => {
    const ahora = Date.now()
    if (ahora - ultimoEnvioRef.current >= THROTTLE_MS) {
      ultimoEnvioRef.current = ahora
      marcar({ id_inscripcion: idInscripcion, id_item_contenido: idItem, segundos_vistos: segundosVistos })
    }
  }

  return { reportarSegundos }
}

export function useIniciarIntento() {
  return useMutation({
    mutationFn: (datos: { id_inscripcion: number; id_quiz: number }) =>
      intentosAdaptador.iniciar(datos),
  })
}

export function useRegistrarRespuestasIntento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, respuestas, id_quiz }: { id: number; respuestas: RespuestaIntento[]; id_quiz: number }) =>
      intentosAdaptador.registrarRespuestas(id, { respuestas, id_quiz }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['progreso-curso'] }),
  })
}
