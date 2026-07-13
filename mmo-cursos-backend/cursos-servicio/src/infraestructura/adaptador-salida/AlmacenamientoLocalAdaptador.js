import AlmacenamientoSalidaPuerto from '../../aplicacion/puertos/salida/AlmacenamientoSalidaPuerto.js'

// Implementación stub/local para desarrollo sin MinIO levantado.
// Las URLs devueltas son ficticias — apuntan a rutas locales que Express NO sirve aún,
// pero son suficientes para tests unitarios y para verificar que el wiring funciona.
export default class AlmacenamientoLocalAdaptador extends AlmacenamientoSalidaPuerto {

    generarUrlSubida = async(key, contentType, expiresInSeconds = 3600) => {
        console.log(`[STUB-LOCAL] URL de subida solicitada para key: ${key}`)
        return {
            estado: 'ok',
            urlSubida: `http://localhost:9000/mmo-cursos/${key}?X-Stub-Upload=true`,
            key
        }
    }

    generarUrlDescarga = async(key, expiresInSeconds = 3600) => {
        return {
            estado: 'ok',
            urlDescarga: `http://localhost:9000/mmo-cursos/${key}?X-Stub-Download=true`
        }
    }

    // Misma URL que generarUrlDescarga porque en local no hay distinción interna/externa
    generarUrlDescargaInterna = async(key, expiresInSeconds = 3600) => {
        return {
            estado: 'ok',
            urlDescarga: `http://localhost:9000/mmo-cursos/${key}?X-Stub-Internal=true`
        }
    }

    eliminarArchivo = async(key) => {
        console.log(`[STUB-LOCAL] Simulando eliminación de: ${key}`)
        return { estado: 'ok' }
    }
}