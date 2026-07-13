import { QuizControlador } from '../adaptador-entrada/QuizControlador.js'
import QuizPgsCommandAdaptador from '../adaptador-salida/QuizPgsCommandAdaptador.js'
import QuizPgsQueryAdaptador from '../adaptador-salida/QuizPgsQueryAdaptador.js'
import QuizCommandUsesCase from '../../aplicacion/uses-cases/command/QuizCommandUsesCase.js'
import QuizQueryUsesCase from '../../aplicacion/uses-cases/query/QuizQueryUsesCase.js'

const quizCommandAdaptador = new QuizPgsCommandAdaptador()
const quizQueryAdaptador = new QuizPgsQueryAdaptador()
const casoUsoCommand = new QuizCommandUsesCase(quizCommandAdaptador, quizQueryAdaptador)
const casoUsoQuery = new QuizQueryUsesCase(quizQueryAdaptador)
const quizControlador = new QuizControlador(casoUsoCommand, casoUsoQuery)

export { quizControlador }