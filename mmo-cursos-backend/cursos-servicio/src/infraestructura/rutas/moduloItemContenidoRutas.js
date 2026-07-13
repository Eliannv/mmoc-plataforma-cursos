import { Router } from 'express'
import { itemContenidoControlador } from '../contenedor/ItemContenidoContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

router.get('/:id', jwtMiddleware(), itemContenidoControlador.obtener)
router.put('/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), itemContenidoControlador.actualizar)
router.delete('/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), itemContenidoControlador.eliminar)

export default router