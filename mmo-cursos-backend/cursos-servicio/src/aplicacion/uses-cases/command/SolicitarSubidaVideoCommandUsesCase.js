/**
 * SolicitarSubidaVideoCommandUsesCase
 *
 * Genera la key determinista del video, la guarda en la BD y devuelve
 * la URL prefirmada PUT para que el instructor suba el archivo directo a MinIO.
 *
 * Flujo:
 *   1. Instructor crea ítem de tipo VIDEO → id_item conocido
 *   2. Instructor llama GET /videos/:idItem/url-subida
 *   3. Este caso de uso genera key="videos/{idItem}/original.mp4",
 *      la persiste en el modelo video y retorna la URL prefirmada PUT
 *   4. El navegador sube el archivo directo a MinIO con esa URL
 *   5. Al terminar la subida, el frontend llama POST /videos/:idItem/confirmar
 */
export default class SolicitarSubidaVideoCommandUsesCase {
    constructor(adaptadorCommandSalida, adaptadorQuerySalida, almacenamiento) {
        this.adaptadorCommandSalida = adaptadorCommandSalida
        this.adaptadorQuerySalida = adaptadorQuerySalida
        this.almacenamiento = almacenamiento
    }

    async solicitarSubida(idItem, contentType = 'video/mp4', expiresInSeconds = 3600) {
        // Verificar que el video existe y está en estado que permite subida
        const videoResp = await this.adaptadorQuerySalida.obtenerPorItem(idItem)
        if (videoResp.estado === 'error' || !videoResp.resultado) {
            return { estado: 'error', resultado: 'Video no encontrado para este ítem de contenido' }
        }

        const video = videoResp.resultado
        if (video.estado_procesamiento === 'LISTO') {
            return { estado: 'error', resultado: 'El video ya fue confirmado. Para reemplazarlo, contacta al administrador.' }
        }

        // Generar key determinista
        const storageKey = `videos/${idItem}/original.mp4`

        // Generar URL prefirmada PUT (accesible desde el navegador)
        const urlResp = await this.almacenamiento.generarUrlSubida(storageKey, contentType, expiresInSeconds)
        if (urlResp.estado === 'error') {
            return urlResp
        }

        // Persistir la storage_key para saber dónde se subirá el archivo
        const actualizacionResp = await this.adaptadorCommandSalida.asignarStorageKey(idItem, storageKey)
        if (actualizacionResp.estado === 'error') {
            return actualizacionResp
        }

        console.log(`✓ URL de subida generada para item ${idItem}, key: ${storageKey}`)
        return {
            estado: 'ok',
            urlSubida: urlResp.urlSubida,
            key: storageKey,
            expiresInSeconds
        }
    }
}