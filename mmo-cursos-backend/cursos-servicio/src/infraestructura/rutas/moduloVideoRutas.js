import { Router } from 'express'
import { videoControlador } from '../contenedor/VideoContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// GET — instructor solicita URL prefirmada PUT para subir el video directo a MinIO
router.get('/:idItem/url-subida', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), videoControlador.solicitarUrlSubida)

// POST — frontend confirma que terminó de subir; se valida duración con ffprobe
router.post('/:idItem/confirmar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), videoControlador.confirmarSubida)

// GET — estudiante obtiene URL prefirmada GET para reproducir el video
router.get('/:idItem/url-descarga', jwtMiddleware(), videoControlador.obtenerUrlDescarga)

export default router