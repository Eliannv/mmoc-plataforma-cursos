import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { videosAdaptador } from '../../infrastructure/adaptadores/contenidoAdaptador'
import axios from 'axios'

// Flujo completo de subida de video:
// 1. Solicitar URL prefirmada PUT al BFF
// 2. Subir el archivo directamente a MinIO con PUT (sin Authorization header)
// 3. Confirmar al BFF (que valida duración con ffprobe)
export function useSubirVideo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ idItem, archivo }: { idItem: number; archivo: File }) => {
      // Paso 1: obtener URL firmada
      const { url_subida } = await videosAdaptador.solicitarUrlSubida(idItem)

      // Paso 2: PUT directo a MinIO (sin JWT, la URL ya lleva la firma)
      await axios.put(url_subida, archivo, {
        headers: { 'Content-Type': archivo.type || 'video/mp4' },
        // No usar el interceptor de auth del httpClient
      })

      // Paso 3: confirmar y validar duración con ffprobe
      const video = await videosAdaptador.confirmarSubida(idItem)
      return video
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items'] })
    },
  })
}

export function useUrlDescargaVideo(idItem: number | null) {
  return useQuery({
    queryKey: ['video-descarga', idItem],
    queryFn: () => videosAdaptador.obtenerUrlDescarga(idItem!),
    enabled: !!idItem,
    staleTime: 50 * 60 * 1000, // 50 min (URL expira en 60)
  })
}
