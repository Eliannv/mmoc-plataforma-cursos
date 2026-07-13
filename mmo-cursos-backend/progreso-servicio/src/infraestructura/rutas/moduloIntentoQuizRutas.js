import { Router } from 'express'
import { intentoQuizControlador } from '../contenedor/IntentoQuizContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// POST — iniciar un intento de quiz
router.post('/', jwtMiddleware(['ESTUDIANTE']), intentoQuizControlador.iniciarIntento)

// GET — ver un intento específico
router.get('/:id', jwtMiddleware(['ESTUDIANTE', 'INSTRUCTOR', 'ADMIN']), intentoQuizControlador.obtenerIntento)

// POST — registrar respuestas y calcular puntaje
router.post('/:id/respuestas', jwtMiddleware(['ESTUDIANTE']), intentoQuizControlador.registrarRespuestas)

export default router