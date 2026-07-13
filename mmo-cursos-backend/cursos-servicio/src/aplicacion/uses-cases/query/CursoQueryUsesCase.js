import CursoFiltro from '../../../dominio/filtros/CursoFiltro.js'

export default class CursoQueryUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async lista(filtros = []) {
        const respuesta = await this.adaptadorBDSalida.lista(filtros)
        return respuesta.resultado || []
    }

    async listarPublicadosPorCategoria(idCategoria) {
        const filtros = [
            new CursoFiltro(idCategoria, 'PUBLICADO', null)
        ]
        const respuesta = await this.adaptadorBDSalida.lista(filtros)
        return respuesta.resultado || []
    }

    async obtenerPorId(dto) {
        const respuesta = await this.adaptadorBDSalida.obtenerPorId(dto.getId())
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Curso no encontrado' }
        return respuesta.resultado
    }

    async obtenerConSeccionesPublico(id) {
        const respuesta = await this.adaptadorBDSalida.obtenerConSeccionesPublico(id)
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Curso no encontrado o no publicado' }
        return respuesta.resultado
    }

    async obtenerConSecciones(id) {
        const respuesta = await this.adaptadorBDSalida.obtenerConSecciones(id)
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Curso no encontrado' }
        return respuesta.resultado
    }
}