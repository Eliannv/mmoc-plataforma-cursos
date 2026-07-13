import Inscripcion from '../../../dominio/entidades/Inscripcion.js'

export default class InscripcionCommandUsesCase {
    constructor(adaptadorCommandSalida, adaptadorQuerySalida) {
        this.adaptadorCommandSalida = adaptadorCommandSalida
        this.adaptadorQuerySalida = adaptadorQuerySalida
    }

    async inscribirse(dtoInscripcion, idUsuario) {
        // Verificar que no esté ya inscrito
        const inscripcionExistente = await this.adaptadorQuerySalida.obtenerPorUsuarioYCurso(idUsuario, dtoInscripcion.getIdCurso())
        if (inscripcionExistente.estado === 'ok' && inscripcionExistente.resultado) {
            return { estado: 'error', resultado: 'El estudiante ya está inscrito en este curso' }
        }

        const inscripcion = new Inscripcion(null, idUsuario, dtoInscripcion.getIdCurso(), new Date(), 'ACTIVO')
        const resultado = await this.adaptadorCommandSalida.guardar(inscripcion)
        console.log('Inscripción registrada en caso de uso')
        return resultado
    }
}