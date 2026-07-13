import CategoriaFiltro from '../../../dominio/filtros/CategoriaFiltro.js'

export default class CategoriaQueryUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async lista() {
        const filtros = []
        const respuesta = await this.adaptadorBDSalida.lista(filtros)
        return respuesta.resultado || []
    }

    async obtenerPorId(dto) {
        const respuesta = await this.adaptadorBDSalida.obtenerPorId(dto.getId())
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Categoría no encontrada' }
        return respuesta.resultado
    }
}