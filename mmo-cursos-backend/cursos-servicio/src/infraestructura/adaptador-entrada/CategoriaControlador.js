import { CategoriaDTO } from '../../aplicacion/dto/CategoriaDTO.js'
import CategoriaEntradaPuerto from '../../aplicacion/puertos/entrada/CategoriaEntradaPuerto.js'

export class CategoriaControlador extends CategoriaEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/categorias') {
        return res.status(code).json({
            data,
            message: msg,
            meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta },
            links: { self: ruta, list: '/api/v1/categorias' }
        })
    }

    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/categorias') {
        return res.status(code).json({
            error: { code: `${code} ${tipo}`, message: msg, details: detalles },
            meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta }
        })
    }

    crear = async(req, res) => {
        try {
            const dto = new CategoriaDTO(req.body || {})
            try { dto.validarCreacion() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.crear(dto)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_CREACION', 'No se pudo crear la categoría', [resultado.resultado], req.path)
            return this._ok(res, resultado, 'Categoría creada exitosamente', 201, `/api/v1/categorias/${resultado.id}`)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    lista = async(req, res) => {
        try {
            const resultado = await this.casoUsoQuery.lista()
            return this._ok(res, resultado, `Se obtuvieron ${resultado.length} categorías`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtener = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new CategoriaDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoQuery.obtenerPorId(dto)
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Categoría no encontrada', [], req.path)
            return this._ok(res, resultado, 'Categoría encontrada', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    actualizar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            if (!req.body || Object.keys(req.body).length === 0) return this._error(res, 400, 'DATOS_VACIOS', 'Debe enviar al menos un campo', [], req.path)
            const dtoData = { id: parseInt(id), ...req.body }
            const dto = new CategoriaDTO(dtoData)
            try { dto.validarActualizacion(req.body) } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.editar(dto, req.body)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Categoría actualizada exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    eliminar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new CategoriaDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoCommand.eliminar(dto)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, null, 'Categoría eliminada exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}