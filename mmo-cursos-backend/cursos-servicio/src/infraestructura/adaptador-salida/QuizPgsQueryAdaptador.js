import QuizSalidaQueryPuerto from '../../aplicacion/puertos/salida/QuizSalidaQueryPuerto.js'
import ModeloQuiz from '../modelos/ModeloQuiz.js'
import ModeloPregunta from '../modelos/ModeloPregunta.js'
import ModeloOpcionPregunta from '../modelos/ModeloOpcionPregunta.js'

export default class QuizPgsQueryAdaptador extends QuizSalidaQueryPuerto {

    obtenerPorItem = async(idItem) => {
        try {
            const quiz = await ModeloQuiz.findOne({ where: { id_item: idItem, deletedAt: null } })
            if (!quiz) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: quiz }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }

    obtenerConPreguntas = async(idQuiz) => {
        try {
            const quiz = await ModeloQuiz.findOne({ where: { id: idQuiz, deletedAt: null } })
            if (!quiz) return { estado: 'error', resultado: null }

            const preguntas = await ModeloPregunta.findAll({
                where: { id_quiz: idQuiz, deletedAt: null },
                order: [
                    ['orden', 'ASC']
                ]
            })

            const preguntasConOpciones = await Promise.all(
                preguntas.map(async(p) => {
                    const opciones = await ModeloOpcionPregunta.findAll({
                        where: { id_pregunta: p.id, deletedAt: null }
                    })
                    return {...p.toJSON(), opciones: opciones.map(o => o.toJSON()) }
                })
            )

            return { estado: 'ok', resultado: {...quiz.toJSON(), preguntas: preguntasConOpciones } }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }

    contarPreguntas = async(idQuiz) => {
        return await ModeloPregunta.count({ where: { id_quiz: idQuiz, deletedAt: null } })
    }
}