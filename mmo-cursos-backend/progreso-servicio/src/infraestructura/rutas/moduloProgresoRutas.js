import { Router } from 'express'
import { progresoControlador } from '../contenedor/ProgresoContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// POST — marcar avance de un ítem de contenido
router.post('/', jwtMiddleware(['ESTUDIANTE']), progresoControlador.marcarAvance)

export default router