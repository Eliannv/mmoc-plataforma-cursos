import ConfirmarVideoCommandUsesCase from '../src/aplicacion/uses-cases/command/ConfirmarVideoCommandUsesCase.js'

// Mock fluent-ffmpeg para que los tests no requieran ffprobe instalado
jest.mock('fluent-ffmpeg', () => ({
    ffprobe: jest.fn()
}))

import ffmpeg from 'fluent-ffmpeg'

describe('ConfirmarVideoCommandUsesCase', () => {
    let commandAdaptadorMock
    let queryAdaptadorMock
    let almacenamientoMock
    let casoUso

    beforeEach(() => {
        commandAdaptadorMock = { confirmarVideo: jest.fn() }
        queryAdaptadorMock = { obtenerPorItem: jest.fn() }
        almacenamientoMock = { generarUrlDescargaInterna: jest.fn() }
        casoUso = new ConfirmarVideoCommandUsesCase(commandAdaptadorMock, queryAdaptadorMock, almacenamientoMock)
        jest.clearAllMocks()
    })

    const videoBase = {
        id: 1,
        id_item: 42,
        storage_key: 'videos/42/original.mp4',
        duracion_segundos: null,
        estado_procesamiento: 'PENDIENTE'
    }

    test('debe confirmar el video como LISTO cuando la duración es válida (180-240s)', async() => {
        queryAdaptadorMock.obtenerPorItem.mockResolvedValue({ estado: 'ok', resultado: videoBase })
        almacenamientoMock.generarUrlDescargaInterna.mockResolvedValue({
            estado: 'ok',
            urlDescarga: 'http://minio:9000/mmo-cursos/videos/42/original.mp4?sig=abc'
        })
        commandAdaptadorMock.confirmarVideo.mockResolvedValue({ estado: 'ok' })

        // Simular ffprobe devolviendo 200 segundos (válido)
        ffmpeg.ffprobe.mockImplementation((url, cb) => {
            cb(null, { format: { duration: 200 } })
        })

        const resultado = await casoUso.confirmar(42)

        expect(resultado.estado).toBe('ok')
        expect(resultado.duracion_segundos).toBe(200)
        expect(resultado.estado_procesamiento).toBe('LISTO')
        expect(commandAdaptadorMock.confirmarVideo).toHaveBeenCalledWith(42, 200, 'LISTO')
    })

    test('debe marcar el video como FALLIDO si la duración es menor a 180s', async() => {
        queryAdaptadorMock.obtenerPorItem.mockResolvedValue({ estado: 'ok', resultado: videoBase })
        almacenamientoMock.generarUrlDescargaInterna.mockResolvedValue({ estado: 'ok', urlDescarga: 'http://minio:9000/test' })
        commandAdaptadorMock.confirmarVideo.mockResolvedValue({ estado: 'ok' })

        ffmpeg.ffprobe.mockImplementation((url, cb) => {
            cb(null, { format: { duration: 120 } }) // 2 minutos — muy corto
        })

        const resultado = await casoUso.confirmar(42)

        expect(resultado.estado).toBe('error')
        expect(resultado.duracion_segundos).toBe(120)
        expect(commandAdaptadorMock.confirmarVideo).toHaveBeenCalledWith(42, 120, 'FALLIDO')
    })

    test('debe marcar el video como FALLIDO si la duración es mayor a 240s', async() => {
        queryAdaptadorMock.obtenerPorItem.mockResolvedValue({ estado: 'ok', resultado: videoBase })
        almacenamientoMock.generarUrlDescargaInterna.mockResolvedValue({ estado: 'ok', urlDescarga: 'http://minio:9000/test' })
        commandAdaptadorMock.confirmarVideo.mockResolvedValue({ estado: 'ok' })

        ffmpeg.ffprobe.mockImplementation((url, cb) => {
            cb(null, { format: { duration: 300 } }) // 5 minutos — muy largo
        })

        const resultado = await casoUso.confirmar(42)

        expect(resultado.estado).toBe('error')
        expect(resultado.duracion_segundos).toBe(300)
        expect(commandAdaptadorMock.confirmarVideo).toHaveBeenCalledWith(42, 300, 'FALLIDO')
    })

    test('debe marcar FALLIDO si ffprobe no puede leer el archivo', async() => {
        queryAdaptadorMock.obtenerPorItem.mockResolvedValue({ estado: 'ok', resultado: videoBase })
        almacenamientoMock.generarUrlDescargaInterna.mockResolvedValue({ estado: 'ok', urlDescarga: 'http://minio:9000/test' })
        commandAdaptadorMock.confirmarVideo.mockResolvedValue({ estado: 'ok' })

        ffmpeg.ffprobe.mockImplementation((url, cb) => {
            cb(new Error('Invalid data found when processing input'), null)
        })

        const resultado = await casoUso.confirmar(42)

        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('No se pudo leer el video subido')
        expect(commandAdaptadorMock.confirmarVideo).toHaveBeenCalledWith(42, null, 'FALLIDO')
    })

    test('debe retornar error si el video aún no tiene storage_key', async() => {
        const videoSinKey = {...videoBase, storage_key: null }
        queryAdaptadorMock.obtenerPorItem.mockResolvedValue({ estado: 'ok', resultado: videoSinKey })

        const resultado = await casoUso.confirmar(42)

        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('aún no fue subido')
        expect(almacenamientoMock.generarUrlDescargaInterna).not.toHaveBeenCalled()
        expect(ffmpeg.ffprobe).not.toHaveBeenCalled()
    })

    test('debe aceptar video con duración exactamente en el límite inferior (180s)', async() => {
        queryAdaptadorMock.obtenerPorItem.mockResolvedValue({ estado: 'ok', resultado: videoBase })
        almacenamientoMock.generarUrlDescargaInterna.mockResolvedValue({ estado: 'ok', urlDescarga: 'http://minio:9000/test' })
        commandAdaptadorMock.confirmarVideo.mockResolvedValue({ estado: 'ok' })

        ffmpeg.ffprobe.mockImplementation((url, cb) => {
            cb(null, { format: { duration: 180 } })
        })

        const resultado = await casoUso.confirmar(42)
        expect(resultado.estado).toBe('ok')
    })

    test('debe aceptar video con duración exactamente en el límite superior (240s)', async() => {
        queryAdaptadorMock.obtenerPorItem.mockResolvedValue({ estado: 'ok', resultado: videoBase })
        almacenamientoMock.generarUrlDescargaInterna.mockResolvedValue({ estado: 'ok', urlDescarga: 'http://minio:9000/test' })
        commandAdaptadorMock.confirmarVideo.mockResolvedValue({ estado: 'ok' })

        ffmpeg.ffprobe.mockImplementation((url, cb) => {
            cb(null, { format: { duration: 240 } })
        })

        const resultado = await casoUso.confirmar(42)
        expect(resultado.estado).toBe('ok')
    })
})