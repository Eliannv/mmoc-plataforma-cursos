export default class SeccionQueryUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async listarPorCurso(idCurso) {
        const respuesta = await this.adaptadorBDSalida.listarPorCurso(idCurso)
        return respuesta.resultado || []
    }

    async obtenerPorId(dto) {
        const respuesta = await this.adaptadorBDSalida.obtenerPorId(dto.getId())
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Sección no encontrada' }
        return respuesta.resultado
    }
}