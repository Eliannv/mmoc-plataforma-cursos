import { Router } from 'express'
import { quizControlador } from '../contenedor/QuizContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// Resolver quiz por item ID (para seed y uso interno)
router.get('/item/:idItem', jwtMiddleware(['ADMIN', 'INSTRUCTOR']), quizControlador.obtenerQuizPorItemId)

// Ver quiz con preguntas (para instructor/admin)
router.get('/:idQuiz/preguntas', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), quizControlador.obtenerConPreguntas)

// Obtener 5 preguntas aleatorias para un intento (estudiante)
router.get('/:idQuiz/preguntas/aleatorias', jwtMiddleware(['ESTUDIANTE']), quizControlador.obtenerPreguntasAleatorias)

// Validar respuestas internamente (BFF) — cualquier autenticado, no revela la respuesta correcta
router.post('/:idQuiz/validar', jwtMiddleware(), quizControlador.validarRespuestas)

// Gestión de preguntas (instructor/admin)
router.post('/:idQuiz/preguntas', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), quizControlador.agregarPregunta)
router.delete('/:idQuiz/preguntas/:idPregunta', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), quizControlador.eliminarPregunta)

export default router