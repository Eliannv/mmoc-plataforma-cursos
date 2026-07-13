import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useTrackingVideo } from '../application/hooks/useProgreso'

vi.mock('../infrastructure/adaptadores/progresoAdaptador', () => ({
  progresoAdaptador: {
    marcarAvance: vi.fn().mockResolvedValue({ estado: 'ok' }),
  },
  inscripcionesAdaptador: { listarMias: vi.fn(), inscribirse: vi.fn(), obtenerProgreso: vi.fn() },
  intentosAdaptador: { iniciar: vi.fn(), registrarRespuestas: vi.fn() },
}))

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return React.createElement(QueryClientProvider, { client: qc }, children)
}

describe('useTrackingVideo', () => {
  beforeEach(() => vi.clearAllMocks())

  it('envía al backend al primer reporte y throttlea los siguientes', async () => {
    const { progresoAdaptador } = await import('../infrastructure/adaptadores/progresoAdaptador')
    const { result } = renderHook(() => useTrackingVideo(1, 42), { wrapper })

    // Primer reporte: debe pasar el throttle
    act(() => result.current.reportarSegundos(5))

    await waitFor(() => expect(progresoAdaptador.marcarAvance).toHaveBeenCalledTimes(1))

    // Segundo reporte inmediato: throttleado, no debe llamar de nuevo
    act(() => result.current.reportarSegundos(8))

    expect(progresoAdaptador.marcarAvance).toHaveBeenCalledTimes(1)
    // TanStack Query v5 pasa un segundo argumento de contexto a la mutationFn — verificamos solo el primero
    const [primerArg] = (progresoAdaptador.marcarAvance as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(primerArg).toEqual({ id_inscripcion: 1, id_item_contenido: 42, segundos_vistos: 5 })
  })
})
