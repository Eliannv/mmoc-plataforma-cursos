export class DocumentoControlador {
    constructor(solicitarSubidaCasoUso, confirmarCasoUso, obtenerUrlDescargaCasoUso) {
        this.solicitarSubidaCasoUso = solicitarSubidaCasoUso
        this.confirmarCasoUso = confirmarCasoUso
        this.obtenerUrlDescargaCasoUso = obtenerUrlDescargaCasoUso
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/documentos') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/documentos') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    // GET /api/v1/documentos/:idItem/url-subida
    solicitarUrlSubida = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) {
                return this._error(res, 400, 'ID_INVALIDO', 'El ID del ítem debe ser un número', [], req.path)
            }
            const contentType = req.query.content_type || 'application/pdf'
            const nombreArchivo = req.query.nombre_archivo || 'documento.pdf'

            const resultado = await this.solicitarSubidaCasoUso.solicitarSubida(parseInt(idItem), contentType, nombreArchivo)
            if (resultado.estado === 'error') {
                return this._error(res, 400, 'FALLO_URL_SUBIDA', resultado.resultado, [], req.path)
            }
            return this._ok(res, {
                url_subida: resultado.urlSubida,
                key: resultado.key,
                expires_in: resultado.expiresInSeconds,
                instrucciones: `Sube el archivo con una petición HTTP PUT a url_subida. Incluye el header Content-Type: ${contentType}.`
            }, 'URL de subida generada', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    // POST /api/v1/documentos/:idItem/confirmar
    confirmarSubida = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) {
                return this._error(res, 400, 'ID_INVALIDO', 'El ID del ítem debe ser un número', [], req.path)
            }
            const { nombre_archivo } = req.body
            if (!nombre_archivo) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Se requiere nombre_archivo', [], req.path)
            }
            const resultado = await this.confirmarCasoUso.confirmar(parseInt(idItem), nombre_archivo)
            if (resultado.estado === 'error') {
                return this._error(res, 400, 'FALLO_CONFIRMAR', resultado.resultado, [], req.path)
            }
            return this._ok(res, { nombre_archivo: resultado.nombre_archivo, storage_key: resultado.storage_key }, 'Documento confirmado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    // GET /api/v1/documentos/:idItem/url-descarga
    obtenerUrlDescarga = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) {
                return this._error(res, 400, 'ID_INVALIDO', 'El ID del ítem debe ser un número', [], req.path)
            }
            const resultado = await this.obtenerUrlDescargaCasoUso.obtenerUrlDescarga(parseInt(idItem))
            if (resultado.estado === 'error') {
                return this._error(res, 404, 'RECURSO_NO_DISPONIBLE', resultado.resultado, [], req.path)
            }
            return this._ok(res, { url_descarga: resultado.urlDescarga, nombre_archivo: resultado.nombre_archivo }, 'URL de descarga generada', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}