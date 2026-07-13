import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { documentosAdaptador } from '../../infrastructure/adaptadores/contenidoAdaptador'
import axios from 'axios'
import type { Documento } from '../../domain/entidades'

interface Props {
  idItem: number
  documento?: Documento
}

export default function DocumentoUploader({ idItem, documento }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [estado, setEstado] = useState<string>('')

  const { mutate: subir, isPending } = useMutation({
    mutationFn: async (archivo: File) => {
      setEstado('Obteniendo URL...')
      const { url_subida } = await documentosAdaptador.solicitarUrlSubida(idItem, {
        nombre_archivo: archivo.name,
        content_type: archivo.type || 'application/pdf',
      })
      setEstado('Subiendo...')
      await axios.put(url_subida, archivo, {
        headers: { 'Content-Type': archivo.type || 'application/pdf' },
      })
      setEstado('Confirmando...')
      return documentosAdaptador.confirmarSubida(idItem, archivo.name)
    },
    onSuccess: () => setEstado('✓ Subido'),
    onError: () => setEstado('✗ Error'),
  })

  if (documento?.storage_key) {
    return <span className="text-success text-xs">✓ {documento.nombre_archivo ?? 'Documento'}</span>
  }

  return (
    <span>
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.pptx,application/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) subir(f) }} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="text-xs text-primary hover:underline disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            {estado}
          </span>
        ) : (
          'Subir archivo'
        )}
      </button>
    </span>
  )
}
