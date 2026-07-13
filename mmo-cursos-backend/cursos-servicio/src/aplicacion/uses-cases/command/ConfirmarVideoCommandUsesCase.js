import ffmpeg from 'fluent-ffmpeg'

const DURACION_MIN_SEGUNDOS = 180 // 3 minutos
const DURACION_MAX_SEGUNDOS = 240 // 4 minutos

/**
 * ConfirmarVideoCommandUsesCase
 *
 * Llamado por el frontend después de que el instructor termina de subir el video a MinIO.
 * Valida la duración mediante ffprobe (apuntando a la URL interna del objeto en MinIO)
 * y actualiza el estado del video en la BD.
 *
 * Flujo server-side:
 *   1. Frontend llama POST /videos/:idItem/confirmar
 *   2. Obtenemos la storage_key del video
 *   3. Generamos URL GET interna (minio:9000) para ffprobe
 *   4. ffprobe lee solo los headers de metadata del MP4 (no descarga todo el binario)
 *   5. Si duracion ∈ [180, 240]s → estado_procesamiento = 'LISTO', se persiste duracion_segundos
 *   6. Si duracion fuera del rango → estado_procesamiento = 'FALLIDO'
 *
 * TODO (Opción A — futura entrega HLS):
 *   Después de marcar LISTO, aquí se encolaría la tarea de transcodificación HLS:
 *     estado_procesamiento = 'PROCESANDO'
 *     await cola.publicar({ tipo: 'TRANSCODIFICAR_VIDEO', idItem, storageKey })
 *   Por ahora se deja el estado como LISTO directamente.
 */
export default class ConfirmarVideoCommandUsesCase {
    constructor(adaptadorCommandSalida, adaptadorQuerySalida, almacenamiento) {
        this.adaptadorCommandSalida = adaptadorCommandSalida
        this.adaptadorQuerySalida = adaptadorQuerySalida
        this.almacenamiento = almacenamiento
    }

    async confirmar(idItem) {
        // Obtener el registro de video
        const videoResp = await this.adaptadorQuerySalida.obtenerPorItem(idItem)
        if (videoResp.estado === 'error' || !videoResp.resultado) {
            return { estado: 'error', resultado: 'Video no encontrado para este ítem de contenido' }
        }

        const video = videoResp.resultado
        if (!video.storage_key) {
            return { estado: 'error', resultado: 'El video aún no fue subido. Solicita la URL de subida primero.' }
        }

        // Generar URL interna (minio:9000) que ffprobe puede alcanzar desde el contenedor
        const urlInterna = await this.almacenamiento.generarUrlDescargaInterna(video.storage_key, 600)
        if (urlInterna.estado === 'error') {
            return urlInterna
        }

        // Ejecutar ffprobe para obtener la duración real del video
        let duracionSegundos
        try {
            duracionSegundos = await this._obtenerDuracion(urlInterna.urlDescarga)
        } catch (error) {
            // Si ffprobe falla (archivo corrupto, no es video, etc.)
            await this.adaptadorCommandSalida.confirmarVideo(idItem, null, 'FALLIDO')
            return {
                estado: 'error',
                resultado: `No se pudo leer el video subido: ${error.message}. Asegúrate de subir un archivo MP4 válido.`
            }
        }

        const duracionEntera = Math.round(duracionSegundos)
        const esValido = duracionEntera >= DURACION_MIN_SEGUNDOS && duracionEntera <= DURACION_MAX_SEGUNDOS

        if (!esValido) {
            await this.adaptadorCommandSalida.confirmarVideo(idItem, duracionEntera, 'FALLIDO')
            return {
                estado: 'error',
                resultado: `Duración inválida: ${duracionEntera}s. El video debe durar entre ${DURACION_MIN_SEGUNDOS}s (3 min) y ${DURACION_MAX_SEGUNDOS}s (4 min).`,
                duracion_segundos: duracionEntera
            }
        }

        // TODO (futura entrega HLS): aquí se encolaría la transcodificación a HLS:
        //   await this.adaptadorCommandSalida.confirmarVideo(idItem, duracionEntera, 'PROCESANDO')
        //   await cola.publicar({ tipo: 'TRANSCODIFICAR_VIDEO', idItem, storageKey: video.storage_key })
        //   return { estado: 'ok', duracion_segundos: duracionEntera, estado_procesamiento: 'PROCESANDO' }

        await this.adaptadorCommandSalida.confirmarVideo(idItem, duracionEntera, 'LISTO')
        console.log(`✓ Video item ${idItem} confirmado: ${duracionEntera}s, estado LISTO`)
        return {
            estado: 'ok',
            duracion_segundos: duracionEntera,
            estado_procesamiento: 'LISTO'
        }
    }

    // Obtiene la duración del video en segundos usando ffprobe (via URL HTTP)
    _obtenerDuracion(url) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(url, (err, metadata) => {
                if (err) return reject(err)
                const duracion = metadata.format.duration
                if (!duracion || isNaN(duracion)) {
                    return reject(new Error('No se pudo determinar la duración del archivo'))
                }
                resolve(parseFloat(duracion))
            })
        })
    }
}