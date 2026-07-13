import { IntentoQuizDTO } from '../../aplicacion/dto/IntentoQuizDTO.js'
import IntentoQuizEntradaPuerto from '../../aplicacion/puertos/entrada/IntentoQuizEntradaPuerto.js'

export class IntentoQuizControlador extends IntentoQuizEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/intentos') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/intentos') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    iniciarIntento = async(req, res) => {
        try {
            const dto = new IntentoQuizDTO(req.body || {})
            try { dto.validarInicio() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.iniciarIntento(dto)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_INICIO', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Intento de quiz iniciado exitosamente', 201, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    registrarRespuestas = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID del intento debe ser un número', [], req.path)
            const dto = new IntentoQuizDTO({ id: parseInt(id), respuestas: req.body.respuestas || [] })
            try { dto.validarRespuestas() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.registrarRespuestas(dto)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_RESPUESTAS', resultado.resultado, [], req.path)
            return this._ok(res, resultado, `Quiz completado. Puntaje: ${resultado.puntaje}%`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtenerIntento = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.obtenerIntento(parseInt(id))
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Intento no encontrado', [], req.path)
            return this._ok(res, resultado, 'Intento obtenido exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}