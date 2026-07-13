import { Router } from 'express'
import { cursoControlador } from '../contenedor/CursoContenedor.js'
import { seccionControlador } from '../contenedor/SeccionContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// Listar cursos publicados por categoría — ESTUDIANTE, INSTRUCTOR, ADMIN
router.get('/categoria/:idCategoria', jwtMiddleware(), cursoControlador.listarPorCategoria)

// Listar cursos publicados (público, sin JWT)
router.get('/publicos', cursoControlador.listarPublicos)

// Obtener curso publicado (público, sin JWT)
router.get('/:id/publico', cursoControlador.obtenerPublico)

// CRUD cursos — INSTRUCTOR y ADMIN
router.get('/', jwtMiddleware(), cursoControlador.lista)
router.get('/:id', jwtMiddleware(), cursoControlador.obtener)
router.post('/', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), cursoControlador.crear)
router.put('/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), cursoControlador.actualizar)
router.delete('/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), cursoControlador.eliminar)

// Publicar / Despublicar
router.put('/:id/publicar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), cursoControlador.publicar)
router.put('/:id/despublicar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), cursoControlador.despublicar)

// Secciones del curso (rutas anidadas)
router.get('/:idCurso/secciones', jwtMiddleware(), seccionControlador.listarPorCurso)
router.post('/:idCurso/secciones', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), seccionControlador.crear)

export default router