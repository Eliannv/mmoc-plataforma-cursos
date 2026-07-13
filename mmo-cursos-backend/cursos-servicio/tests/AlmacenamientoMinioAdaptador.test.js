/**
 * Tests unitarios de AlmacenamientoMinioAdaptador
 * El cliente de MinIO se mockea completamente — no se necesita MinIO real.
 */
import AlmacenamientoMinioAdaptador from '../src/infraestructura/adaptador-salida/AlmacenamientoMinioAdaptador.js'

// Mock del SDK minio — reemplaza el módulo antes de importar el adaptador
jest.mock('minio', () => {
    const presignedPutObject = jest.fn()
    const presignedGetObject = jest.fn()
    const removeObject = jest.fn()
    const Client = jest.fn().mockImplementation(() => ({
        presignedPutObject,
        presignedGetObject,
        removeObject
    }))
    return { Client }
})

describe('AlmacenamientoMinioAdaptador', () => {
    let adaptador

    beforeEach(() => {
        jest.clearAllMocks()
        process.env.MINIO_ENDPOINT = 'minio'
        process.env.MINIO_PUBLIC_ENDPOINT = 'localhost'
        process.env.MINIO_PORT = '9000'
        process.env.MINIO_ACCESS_KEY = 'minioadmin'
        process.env.MINIO_SECRET_KEY = 'minioadmin123'
        process.env.MINIO_BUCKET = 'mmo-cursos'
        process.env.MINIO_USE_SSL = 'false'
        adaptador = new AlmacenamientoMinioAdaptador()
    })

    describe('generarUrlSubida', () => {
        test('debe retornar urlSubida y key cuando MinIO responde correctamente', async() => {
            const urlEsperada = 'http://localhost:9000/mmo-cursos/videos/42/original.mp4?X-Amz-Signature=abc'
            adaptador.clientePublico.presignedPutObject.mockResolvedValue(urlEsperada)

            const resultado = await adaptador.generarUrlSubida('videos/42/original.mp4', 'video/mp4', 3600)

            expect(resultado.estado).toBe('ok')
            expect(resultado.urlSubida).toBe(urlEsperada)
            expect(resultado.key).toBe('videos/42/original.mp4')
            expect(adaptador.clientePublico.presignedPutObject).toHaveBeenCalledWith(
                'mmo-cursos', 'videos/42/original.mp4', 3600
            )
        })

        test('debe retornar error cuando MinIO lanza excepción', async() => {
            adaptador.clientePublico.presignedPutObject.mockRejectedValue(new Error('MinIO no disponible'))

            const resultado = await adaptador.generarUrlSubida('videos/42/original.mp4', 'video/mp4', 3600)

            expect(resultado.estado).toBe('error')
            expect(resultado.resultado).toContain('Error generando URL de subida')
        })
    })

    describe('generarUrlDescarga', () => {
        test('debe retornar urlDescarga usando clientePublico', async() => {
            const urlEsperada = 'http://localhost:9000/mmo-cursos/videos/42/original.mp4?X-Amz-Signature=xyz'
            adaptador.clientePublico.presignedGetObject.mockResolvedValue(urlEsperada)

            const resultado = await adaptador.generarUrlDescarga('videos/42/original.mp4', 3600)

            expect(resultado.estado).toBe('ok')
            expect(resultado.urlDescarga).toBe(urlEsperada)
        })
    })

    describe('generarUrlDescargaInterna', () => {
        test('debe usar clienteInterno (no clientePublico) para generar URL interna', async() => {
            const urlInterna = 'http://minio:9000/mmo-cursos/videos/42/original.mp4?X-Amz-Signature=int'
            adaptador.clienteInterno.presignedGetObject.mockResolvedValue(urlInterna)

            const resultado = await adaptador.generarUrlDescargaInterna('videos/42/original.mp4', 600)

            expect(resultado.estado).toBe('ok')
            expect(resultado.urlDescarga).toBe(urlInterna)
                // Verificar que se usó el cliente INTERNO, no el público
            expect(adaptador.clienteInterno.presignedGetObject).toHaveBeenCalled()
            expect(adaptador.clientePublico.presignedGetObject).not.toHaveBeenCalled()
        })
    })

    describe('eliminarArchivo', () => {
        test('debe eliminar el objeto usando clienteInterno', async() => {
            adaptador.clienteInterno.removeObject.mockResolvedValue()

            const resultado = await adaptador.eliminarArchivo('videos/42/original.mp4')

            expect(resultado.estado).toBe('ok')
            expect(adaptador.clienteInterno.removeObject).toHaveBeenCalledWith(
                'mmo-cursos', 'videos/42/original.mp4'
            )
        })

        test('debe retornar error si MinIO lanza excepción al eliminar', async() => {
            adaptador.clienteInterno.removeObject.mockRejectedValue(new Error('Object not found'))

            const resultado = await adaptador.eliminarArchivo('videos/99/original.mp4')

            expect(resultado.estado).toBe('error')
            expect(resultado.resultado).toContain('Error eliminando archivo')
        })
    })
})