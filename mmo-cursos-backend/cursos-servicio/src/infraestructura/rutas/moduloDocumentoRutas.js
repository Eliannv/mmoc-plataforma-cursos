import { Router } from 'express'
import { documentoControlador } from '../contenedor/DocumentoContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router({ mergeParams: true })

// GET /api/v1/documentos/:idItem/url-subida  (instructor)
router.get('/:idItem/url-subida', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), documentoControlador.solicitarUrlSubida)

// POST /api/v1/documentos/:idItem/confirmar  (instructor)
router.post('/:idItem/confirmar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), documentoControlador.confirmarSubida)

// GET /api/v1/documentos/:idItem/url-descarga  (cualquier autenticado)
router.get('/:idItem/url-descarga', jwtMiddleware(), documentoControlador.obtenerUrlDescarga)

export default router