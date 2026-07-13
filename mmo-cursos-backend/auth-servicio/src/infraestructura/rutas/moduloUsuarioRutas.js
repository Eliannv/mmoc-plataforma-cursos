import { Router } from 'express'
import { authControlador } from '../contenedor/AuthContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// GET /api/v1/usuarios  (admin)
router.get('/', jwtMiddleware(['ADMIN']), authControlador.listarUsuarios)

// PATCH /api/v1/usuarios/:id/rol  (admin)
router.patch('/:id/rol', jwtMiddleware(['ADMIN']), authControlador.cambiarRol)

export default router