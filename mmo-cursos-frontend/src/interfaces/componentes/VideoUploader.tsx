import { useRef } from 'react'
import { useSubirVideo } from '../../application/hooks/useContenido'
import type { Video } from '../../domain/entidades'

interface Props {
  idItem: number
  video?: Video
}

export default function VideoUploader({ idItem, video }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { mutate: subir, isPending, data } = useSubirVideo()

  const estadoActual = data?.estado_procesamiento ?? video?.estado_procesamiento

  function handleArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    subir({ idItem, archivo }, {})
  }

  if (estadoActual === 'LISTO') {
    return <span className="text-success text-xs">✓ Video listo</span>
  }

  return (
    <span>
      <input ref={inputRef} type="file" accept="video/mp4,video/*" className="hidden" onChange={handleArchivo} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="text-xs text-primary hover:underline disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            Subiendo...
          </span>
        ) : estadoActual === 'FALLIDO' ? (
          'Reintentar'
        ) : (
          'Subir video'
        )}
      </button>
      {estadoActual === 'FALLIDO' && (
        <span className="text-error text-xs ml-1">Duración inválida</span>
      )}
    </span>
  )
}
