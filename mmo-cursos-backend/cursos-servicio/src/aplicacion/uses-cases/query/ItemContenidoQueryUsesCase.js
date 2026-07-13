export default class ItemContenidoQueryUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async listarPorSeccion(idSeccion) {
        const respuesta = await this.adaptadorBDSalida.listarPorSeccion(idSeccion)
        return respuesta.resultado || []
    }

    async obtenerPorId(dto) {
        const respuesta = await this.adaptadorBDSalida.obtenerPorId(dto.getId())
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Ítem no encontrado' }
        return respuesta.resultado
    }
}