import IntentoQuiz from '../../../dominio/entidades/IntentoQuiz.js'

export default class IntentoQuizCommandUsesCase {
    constructor(adaptadorCommandSalida) {
        this.adaptadorCommandSalida = adaptadorCommandSalida
    }

    async iniciarIntento(dtoIntento) {
        const intento = new IntentoQuiz(
            null,
            dtoIntento.getIdInscripcion(),
            dtoIntento.getIdQuiz(),
            dtoIntento.getIdsPreguntas(),
            null,
            false,
            new Date(),
            null
        )
        const resultado = await this.adaptadorCommandSalida.iniciar(intento)
        console.log('Intento de quiz iniciado en caso de uso')
        return resultado
    }

    // respuestas: Array de { id_pregunta, id_opcion_seleccionada, es_correcta }
    // es_correcta es validado por el BFF que consulta cursos-servicio
    async registrarRespuestas(dtoIntento) {
        const resultado = await this.adaptadorCommandSalida.registrarRespuestasYCalcularPuntaje(
            dtoIntento.getId(),
            dtoIntento.getRespuestas()
        )
        console.log('Respuestas de intento registradas en caso de uso')
        return resultado
    }
}