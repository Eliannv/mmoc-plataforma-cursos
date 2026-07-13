import Pregunta from '../../../dominio/entidades/Pregunta.js'
import OpcionPregunta from '../../../dominio/entidades/OpcionPregunta.js'

const MAX_PREGUNTAS_POR_QUIZ = 20

export default class QuizCommandUsesCase {
    constructor(adaptadorBDSalida, adaptadorQuerySalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
        this.adaptadorQuerySalida = adaptadorQuerySalida
    }

    async agregarPregunta(dtoPregunta) {
        if (!dtoPregunta.getIdQuiz()) {
            return { estado: 'error', resultado: 'El id_quiz es requerido' }
        }

        const total = await this.adaptadorQuerySalida.contarPreguntas(dtoPregunta.getIdQuiz())
        if (total >= MAX_PREGUNTAS_POR_QUIZ) {
            return { estado: 'error', resultado: `El quiz ya tiene el máximo de ${MAX_PREGUNTAS_POR_QUIZ} preguntas` }
        }

        const pregunta = new Pregunta(null, dtoPregunta.getIdQuiz(), dtoPregunta.getEnunciado(), dtoPregunta.getOrden())
        const opciones = dtoPregunta.getOpciones().map(o => new OpcionPregunta(null, null, o.texto, o.es_correcta))

        const resultado = await this.adaptadorBDSalida.agregarPregunta(pregunta, opciones)
        console.log('Pregunta agregada al quiz en caso de uso')
        return resultado
    }

    async eliminarPregunta(idPregunta) {
        if (!idPregunta) {
            return { estado: 'error', resultado: 'El ID de la pregunta es requerido' }
        }
        return await this.adaptadorBDSalida.eliminarPregunta(idPregunta)
    }
}