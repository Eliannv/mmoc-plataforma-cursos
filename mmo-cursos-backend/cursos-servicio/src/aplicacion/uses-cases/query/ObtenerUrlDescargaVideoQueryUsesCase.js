export default class ObtenerUrlDescargaVideoQueryUsesCase {
    constructor(adaptadorQuerySalida, almacenamiento) {
        this.adaptadorQuerySalida = adaptadorQuerySalida
        this.almacenamiento = almacenamiento
    }

    async obtenerUrlDescarga(idItem, expiresInSeconds = 3600) {
        const videoResp = await this.adaptadorQuerySalida.obtenerPorItem(idItem)
        if (videoResp.estado === 'error' || !videoResp.resultado) {
            return { estado: 'error', resultado: 'Video no encontrado' }
        }

        const video = videoResp.resultado
        if (!video.storage_key) {
            return { estado: 'error', resultado: 'El video aún no fue subido' }
        }

        if (video.estado_procesamiento !== 'LISTO') {
            return {
                estado: 'error',
                resultado: `El video no está listo. Estado actual: ${video.estado_procesamiento}`
            }
        }

        const urlResp = await this.almacenamiento.generarUrlDescarga(video.storage_key, expiresInSeconds)
        if (urlResp.estado === 'error') return urlResp

        return {
            estado: 'ok',
            urlDescarga: urlResp.urlDescarga,
            duracion_segundos: video.duracion_segundos,
            expiresInSeconds
        }
    }
}