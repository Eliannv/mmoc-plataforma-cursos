export default class InscripcionQueryUsesCase {
    constructor(adaptadorQuerySalida, adaptadorProgresoQuery) {
        this.adaptadorQuerySalida = adaptadorQuerySalida
        this.adaptadorProgresoQuery = adaptadorProgresoQuery
    }

    async listarMisInscripciones(idUsuario) {
        const respuesta = await this.adaptadorQuerySalida.listarPorUsuario(idUsuario)
        return respuesta.resultado || []
    }

    async obtenerProgresoCurso(idUsuario, idCurso) {
        const inscripcionResp = await this.adaptadorQuerySalida.obtenerPorUsuarioYCurso(idUsuario, idCurso)
        if (inscripcionResp.estado === 'error' || !inscripcionResp.resultado) {
            return { estado: 'error', resultado: 'No estás inscrito en este curso' }
        }
        const inscripcion = inscripcionResp.resultado
        const progresoResp = await this.adaptadorProgresoQuery.listarPorInscripcion(inscripcion.id)
        return {
            estado: 'ok',
            resultado: {
                inscripcion,
                items_completados: progresoResp.resultado || []
            }
        }
    }
}