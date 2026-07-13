import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { videosAdaptador } from '../../infrastructure/adaptadores/contenidoAdaptador'
import { useTrackingVideo } from '../../application/hooks/useProgreso'

interface Props {
  idItem: number
  idInscripcion: number
  onCompletado?: () => void
}

export default function VideoPlayer({ idItem, idInscripcion, onCompletado }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mostrar, setMostrar] = useState(false)
  const { reportarSegundos } = useTrackingVideo(idInscripcion, idItem)
  const completadoRef = useRef(false)

  const { data, isLoading } = useQuery({
    queryKey: ['video-url', idItem],
    queryFn: () => videosAdaptador.obtenerUrlDescarga(idItem),
    enabled: mostrar,
    staleTime: 50 * 60 * 1000,
  })

  function handleTimeUpdate() {
    const v = videoRef.current
    if (!v) return
    reportarSegundos(Math.floor(v.currentTime))
  }

  function handleEnded() {
    const v = videoRef.current
    if (!v) return
    reportarSegundos(Math.floor(v.currentTime))
    if (!completadoRef.current) {
      completadoRef.current = true
      onCompletado?.()
    }
  }

  if (!mostrar) {
    return (
      <button
        onClick={() => setMostrar(true)}
        className="text-sm text-primary hover:underline mt-1"
      >
        ▶ Reproducir
      </button>
    )
  }

  if (isLoading) return <p className="text-sm text-neutral-text mt-1">Cargando video...</p>

  return (
    <video
      ref={videoRef}
      src={data?.url_descarga}
      controls
      className="mt-2 w-full max-w-2xl rounded-lg border border-border"
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  )
}
