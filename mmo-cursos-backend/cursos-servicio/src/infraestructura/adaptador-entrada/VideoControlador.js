import VideoEntradaPuerto from '../../aplicacion/puertos/entrada/VideoEntradaPuerto.js'

export class VideoControlador extends VideoEntradaPuerto {
    constructor(solicitarSubidaCasoUso, confirmarCasoUso, obtenerUrlDescargaCasoUso) {
        super()
        this.solicitarSubidaCasoUso = solicitarSubidaCasoUso
        this.confirmarCasoUso = confirmarCasoUso
        this.obtenerUrlDescargaCasoUso = obtenerUrlDescargaCasoUso
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/videos') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/videos') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    // GET /api/v1/videos/:idItem/url-subida
    // Instructor solicita URL prefirmada PUT para subir el video directo a MinIO
    solicitarUrlSubida = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) {
                return this._error(res, 400, 'ID_INVALIDO', 'El ID del ítem debe ser un número', [], req.path)
            }

            const contentType = req.query.content_type || 'video/mp4'
            const resultado = await this.solicitarSubidaCasoUso.solicitarSubida(parseInt(idItem), contentType)
            if (resultado.estado === 'error') {
                return this._error(res, 400, 'FALLO_URL_SUBIDA', resultado.resultado, [], req.path)
            }

            return this._ok(res, {
                url_subida: resultado.urlSubida,
                key: resultado.key,
                expires_in: resultado.expiresInSeconds,
                instrucciones: 'Sube el archivo MP4 con una petición HTTP PUT a url_subida. Incluye el header Content-Type: video/mp4.'
            }, 'URL de subida generada. El archivo debe durar entre 3 y 4 minutos.', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    // POST /api/v1/videos/:idItem/confirmar
    // Frontend llama este endpoint después de subir el archivo a MinIO.
    // Valida la duración con ffprobe y actualiza el estado del video.
    confirmarSubida = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) {
                return this._error(res, 400, 'ID_INVALIDO', 'El ID del ítem debe ser un número', [], req.path)
            }

            const resultado = await this.confirmarCasoUso.confirmar(parseInt(idItem))
            if (resultado.estado === 'error') {
                return this._error(res, 422, 'VIDEO_INVALIDO', resultado.resultado,
                    resultado.duracion_segundos ? [`Duración detectada: ${resultado.duracion_segundos}s`] : [],
                    req.path)
            }

            return this._ok(res, {
                duracion_segundos: resultado.duracion_segundos,
                estado_procesamiento: resultado.estado_procesamiento
            }, `Video validado y listo. Duración: ${resultado.duracion_segundos}s`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    // GET /api/v1/videos/:idItem/url-descarga
    // Estudiante solicita URL prefirmada GET para reproducir o descargar el video
    obtenerUrlDescarga = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) {
                return this._error(res, 400, 'ID_INVALIDO', 'El ID del ítem debe ser un número', [], req.path)
            }

            const resultado = await this.obtenerUrlDescargaCasoUso.obtenerUrlDescarga(parseInt(idItem))
            if (resultado.estado === 'error') {
                return this._error(res, 404, 'VIDEO_NO_DISPONIBLE', resultado.resultado, [], req.path)
            }

            return this._ok(res, {
                url_descarga: resultado.urlDescarga,
                duracion_segundos: resultado.duracion_segundos,
                expires_in: resultado.expiresInSeconds
            }, 'URL de descarga generada', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}