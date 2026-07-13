import { InscripcionDTO } from '../../aplicacion/dto/InscripcionDTO.js'
import InscripcionEntradaPuerto from '../../aplicacion/puertos/entrada/InscripcionEntradaPuerto.js'

export class InscripcionControlador extends InscripcionEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/inscripciones') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/inscripciones') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    inscribirse = async(req, res) => {
        try {
            const idUsuario = req.usuario.id
            const dto = new InscripcionDTO(req.body || {})
            try { dto.validarCreacion() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.inscribirse(dto, idUsuario)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_INSCRIPCION', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Inscripción realizada exitosamente', 201, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    listarMisInscripciones = async(req, res) => {
        try {
            const idUsuario = req.usuario.id
            const resultado = await this.casoUsoQuery.listarMisInscripciones(idUsuario)
            return this._ok(res, resultado, `Se encontraron ${resultado.length} inscripciones`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtenerProgresoCurso = async(req, res) => {
        try {
            const idUsuario = req.usuario.id
            const { idCurso } = req.params
            if (!idCurso || isNaN(parseInt(idCurso))) return this._error(res, 400, 'ID_INVALIDO', 'El ID del curso debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.obtenerProgresoCurso(idUsuario, parseInt(idCurso))
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, resultado.resultado, 'Progreso en el curso obtenido exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}