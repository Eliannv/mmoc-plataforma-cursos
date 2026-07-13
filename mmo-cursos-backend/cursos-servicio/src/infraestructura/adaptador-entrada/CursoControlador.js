import { CursoDTO } from '../../aplicacion/dto/CursoDTO.js'
import CursoEntradaPuerto from '../../aplicacion/puertos/entrada/CursoEntradaPuerto.js'
import CursoFiltro from '../../dominio/filtros/CursoFiltro.js'

export class CursoControlador extends CursoEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/cursos') {
        return res.status(code).json({
            data,
            message: msg,
            meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta },
            links: { self: ruta, list: '/api/v1/cursos' }
        })
    }

    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/cursos') {
        return res.status(code).json({
            error: { code: `${code} ${tipo}`, message: msg, details: detalles },
            meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta }
        })
    }

    crear = async(req, res) => {
        try {
            const rol = req.usuario.rol
            const idInstructor = req.usuario.id
            const dto = new CursoDTO(req.body || {})
                // El instructor ID viene del token
            try { dto.validarCreacion() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.crear(dto, idInstructor)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_CREACION', 'No se pudo crear el curso', [resultado.resultado], req.path)
            return this._ok(res, resultado, 'Curso creado exitosamente', 201, `/api/v1/cursos/${resultado.id}`)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    lista = async(req, res) => {
        try {
            const { id_categoria, estado } = req.query
            const filtros = []
            if (id_categoria || estado) {
                filtros.push(new CursoFiltro(id_categoria ? parseInt(id_categoria) : null, estado || null, null))
            }
            const resultado = await this.casoUsoQuery.lista(filtros)
            return this._ok(res, resultado, `Se obtuvieron ${resultado.length} cursos`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    listarPublicos = async(req, res) => {
        try {
            const { id_categoria } = req.query
            const filtros = [new CursoFiltro(id_categoria ? parseInt(id_categoria) : null, 'PUBLICADO', null)]
            const resultado = await this.casoUsoQuery.lista(filtros)
            return this._ok(res, resultado, `Se obtuvieron ${resultado.length} cursos`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    listarPorCategoria = async(req, res) => {
        try {
            const { idCategoria } = req.params
            if (!idCategoria || isNaN(parseInt(idCategoria))) return this._error(res, 400, 'ID_INVALIDO', 'El ID de categoría debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.listarPublicadosPorCategoria(parseInt(idCategoria))
            return this._ok(res, resultado, `Se obtuvieron ${resultado.length} cursos publicados`, 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtenerPublico = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.obtenerConSeccionesPublico(parseInt(id))
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Curso no encontrado o no publicado', [], req.path)
            return this._ok(res, resultado, 'Curso encontrado', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtener = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new CursoDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoQuery.obtenerConSecciones(parseInt(id))
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Curso no encontrado', [], req.path)
            return this._ok(res, resultado, 'Curso encontrado', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    actualizar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new CursoDTO({ id: parseInt(id), ...req.body })
            try { dto.validarActualizacion(req.body) } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.editar(dto, req.body)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Curso actualizado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    eliminar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const dto = new CursoDTO({ id: parseInt(id) })
            const resultado = await this.casoUsoCommand.eliminar(dto)
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, null, 'Curso eliminado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    publicar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const resultado = await this.casoUsoCommand.publicar(parseInt(id))
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Curso publicado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    despublicar = async(req, res) => {
        try {
            const { id } = req.params
            if (!id || isNaN(parseInt(id))) return this._error(res, 400, 'ID_INVALIDO', 'El ID debe ser un número', [], req.path)
            const resultado = await this.casoUsoCommand.despublicar(parseInt(id))
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Curso despublicado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}