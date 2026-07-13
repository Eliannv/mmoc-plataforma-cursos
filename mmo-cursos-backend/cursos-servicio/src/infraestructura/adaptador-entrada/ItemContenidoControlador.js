import { ItemContenidoDTO } from '../../aplicacion/dto/ItemContenidoDTO.js'
import ItemContenidoEntradaPuerto from '../../aplicacion/puertos/entrada/ItemContenidoEntradaPuerto.js'

export class ItemContenidoControlador extends ItemContenidoEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/items') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/items') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    crear = async(req, res) => {
        try {
            const idSeccion = req.params.idSeccion || req.body.id_seccion
            const dto = new ItemContenidoDTO({...req.body, id_seccion: idSeccion ? parseInt(idSeccion) : null })
            try { dto.validarCreacion() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.crear(dto)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_CREACION', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Ítem de contenido creado exitosamente', 201, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    listarPorSeccion = async(req, res) => {
        try {
            const { idSeccion } = req.params
            if (!idSeccion || isNaN(parseInt(idSeccion))) return this._error(res, 400, 'ID_INVALIDO', 'El ID de sección debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.listarPorSeccion(parseInt(idSeccion))
            return this._ok(res, resultado, `Se obtuvieron ${resultado.length} ítems`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtener = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new ItemContenidoDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoQuery.obtenerPorId(dto)
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Ítem no encontrado', [], req.path)
            return this._ok(res, resultado, 'Ítem encontrado', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    actualizar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new ItemContenidoDTO({ id: parseInt(id), ...req.body })
            const resultado = await this.casoUsoCommand.editar(dto, req.body)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Ítem actualizado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    eliminar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new ItemContenidoDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoCommand.eliminar(dto)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, null, 'Ítem eliminado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}