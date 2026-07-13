export default class IntentoQuizQueryUsesCase {
    constructor(adaptadorQuerySalida) {
        this.adaptadorQuerySalida = adaptadorQuerySalida
    }

    async obtenerIntento(id) {
        const respuesta = await this.adaptadorQuerySalida.obtenerPorId(id)
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Intento no encontrado' }
        return respuesta.resultado
    }
}