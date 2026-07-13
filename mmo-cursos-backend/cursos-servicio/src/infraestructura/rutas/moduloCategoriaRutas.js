import { Router } from 'express'
import { categoriaControlador } from '../contenedor/CategoriaContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// GET — público (categorías no tienen datos sensibles)
router.get('/', categoriaControlador.lista)
router.get('/:id', jwtMiddleware(), categoriaControlador.obtener)

// Write — solo ADMIN
router.post('/', jwtMiddleware(['ADMIN']), categoriaControlador.crear)
router.put('/:id', jwtMiddleware(['ADMIN']), categoriaControlador.actualizar)
router.delete('/:id', jwtMiddleware(['ADMIN']), categoriaControlador.eliminar)

export default router