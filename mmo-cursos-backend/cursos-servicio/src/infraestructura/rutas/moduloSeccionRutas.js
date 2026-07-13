import { Router } from 'express'
import { seccionControlador } from '../contenedor/SeccionContenedor.js'
import { itemContenidoControlador } from '../contenedor/ItemContenidoContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// CRUD secciones
router.get('/:id', jwtMiddleware(), seccionControlador.obtener)
router.put('/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), seccionControlador.actualizar)
router.delete('/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), seccionControlador.eliminar)

// Ítems de contenido de una sección (rutas anidadas)
router.get('/:idSeccion/items', jwtMiddleware(), itemContenidoControlador.listarPorSeccion)
router.post('/:idSeccion/items', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), itemContenidoControlador.crear)

export default router