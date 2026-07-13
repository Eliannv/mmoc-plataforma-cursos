import { SeccionDTO } from '../../aplicacion/dto/SeccionDTO.js'
import SeccionEntradaPuerto from '../../aplicacion/puertos/entrada/SeccionEntradaPuerto.js'

export class SeccionControlador extends SeccionEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/secciones') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/secciones') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    crear = async(req, res) => {
        try {
            const idCurso = req.params.idCurso || req.body.id_curso
            const dto = new SeccionDTO({...req.body, id_curso: idCurso ? parseInt(idCurso) : null })
            try { dto.validarCreacion() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.crear(dto)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_CREACION', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Sección creada exitosamente', 201, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    listarPorCurso = async(req, res) => {
        try {
            const { idCurso } = req.params
            if (!idCurso || isNaN(parseInt(idCurso))) return this._error(res, 400, 'ID_INVALIDO', 'El ID del curso debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.listarPorCurso(parseInt(idCurso))
            return this._ok(res, resultado, `Se obtuvieron ${resultado.length} secciones`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtener = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new SeccionDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoQuery.obtenerPorId(dto)
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Sección no encontrada', [], req.path)
            return this._ok(res, resultado, 'Sección encontrada', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    actualizar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new SeccionDTO({ id: parseInt(id), ...req.body })
            const resultado = await this.casoUsoCommand.editar(dto, req.body)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Sección actualizada exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    eliminar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new SeccionDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoCommand.eliminar(dto)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, null, 'Sección eliminada exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}