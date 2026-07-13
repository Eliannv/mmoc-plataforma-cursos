import { Router } from 'express'
import { inscripcionControlador } from '../contenedor/InscripcionContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// POST — solo ESTUDIANTE puede inscribirse
router.post('/', jwtMiddleware(['ESTUDIANTE']), inscripcionControlador.inscribirse)

// GET — el estudiante lista sus propias inscripciones
router.get('/', jwtMiddleware(['ESTUDIANTE']), inscripcionControlador.listarMisInscripciones)

// GET progreso en un curso específico (para reanudar donde quedó)
router.get('/cursos/:idCurso/progreso', jwtMiddleware(['ESTUDIANTE']), inscripcionControlador.obtenerProgresoCurso)

export default router