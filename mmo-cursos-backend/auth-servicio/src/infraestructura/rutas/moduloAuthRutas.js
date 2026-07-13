import { Router } from 'express'
import { authControlador } from '../contenedor/AuthContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// POST /api/v1/auth/registro
router.post('/registro', authControlador.registrar)

// POST /api/v1/auth/login
router.post('/login', authControlador.login)

// GET /api/v1/auth/perfil  (requiere JWT, cualquier rol autenticado)
router.get('/perfil', jwtMiddleware(), authControlador.obtenerPerfil)

export default router