import { Router } from 'express'
import { bffControlador } from '../contenedor/BffContenedor.js'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

const router = Router()

// ── AUTH (público) ────────────────────────────────────────────
router.post('/auth/registro', bffControlador.registrar)
router.post('/auth/login', bffControlador.login)
router.get('/auth/perfil', jwtMiddleware(), bffControlador.perfil)

// ── CATEGORÍAS (público) ──────────────────────────────────────
router.get('/categorias', bffControlador.listarCategorias)
router.post('/categorias', jwtMiddleware(['ADMIN']), bffControlador.crearCategoria)
router.get('/categorias/:id', jwtMiddleware(), bffControlador.obtenerCategoria)
router.put('/categorias/:id', jwtMiddleware(['ADMIN']), bffControlador.actualizarCategoria)
router.delete('/categorias/:id', jwtMiddleware(['ADMIN']), bffControlador.eliminarCategoria)
    // ── CURSOS ────────────────────────────────────────────────────
router.get('/cursos/publicos', bffControlador.listarCursosPublicos)
router.get('/cursos/publico/:id', bffControlador.obtenerCursoPublico)
router.get('/cursos', jwtMiddleware(), bffControlador.listarCursos)
router.post('/cursos', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.crearCurso)
router.get('/cursos/categoria/:idCategoria', jwtMiddleware(), bffControlador.listarCursosPorCategoria)
router.get('/cursos/:id', jwtMiddleware(), bffControlador.obtenerCurso)
router.put('/cursos/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.actualizarCurso)
router.delete('/cursos/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.eliminarCurso)
router.put('/cursos/:id/publicar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.publicarCurso)
router.put('/cursos/:id/despublicar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.despublicarCurso)

// ── SECCIONES ─────────────────────────────────────────────────
router.get('/cursos/:idCurso/secciones', jwtMiddleware(), bffControlador.listarSecciones)
router.post('/cursos/:idCurso/secciones', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.crearSeccion)
router.get('/secciones/:id', jwtMiddleware(), bffControlador.obtenerSeccion)
router.put('/secciones/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.actualizarSeccion)
router.delete('/secciones/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.eliminarSeccion)
    // ── ÍTEMS DE CONTENIDO ────────────────────────────────────────
router.get('/secciones/:idSeccion/items', jwtMiddleware(), bffControlador.listarItems)
router.post('/secciones/:idSeccion/items', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.crearItem)
router.get('/items/:id', jwtMiddleware(), bffControlador.obtenerItem)
router.put('/items/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.actualizarItem)
router.delete('/items/:id', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.eliminarItem)
    // ── QUIZZES ───────────────────────────────────────────────────
router.get('/quizzes/:idQuiz/preguntas', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.obtenerQuizConPreguntas)
router.post('/quizzes/:idQuiz/preguntas', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.agregarPregunta)
router.delete('/quizzes/:idQuiz/preguntas/:idPregunta', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.eliminarPregunta)

// ── INSCRIPCIONES ─────────────────────────────────────────────
router.post('/inscripciones', jwtMiddleware(['ESTUDIANTE']), bffControlador.inscribirse)
router.get('/inscripciones', jwtMiddleware(['ESTUDIANTE']), bffControlador.listarMisInscripciones)
router.get('/inscripciones/cursos/:idCurso/progreso', jwtMiddleware(['ESTUDIANTE']), bffControlador.obtenerProgresoCurso)

// ── PROGRESO ──────────────────────────────────────────────────
router.post('/progreso', jwtMiddleware(['ESTUDIANTE']), bffControlador.marcarAvance)

// ── VIDEOS (presigned URLs) ────────────────────────────────────
// Instructor solicita URL prefirmada PUT para subir video directo a MinIO
router.get('/videos/:idItem/url-subida', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.solicitarUrlSubidaVideo)
    // Frontend confirma que terminó la subida; cursos-servicio valida duración con ffprobe
router.post('/videos/:idItem/confirmar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.confirmarSubidaVideo)
    // Estudiante obtiene URL prefirmada GET para reproducir el video
router.get('/videos/:idItem/url-descarga', jwtMiddleware(), bffControlador.obtenerUrlDescargaVideo)

// ── DOCUMENTOS (presigned URLs) ───────────────────────────────
router.get('/documentos/:idItem/url-subida', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.solicitarUrlSubidaDocumento)
router.post('/documentos/:idItem/confirmar', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.confirmarSubidaDocumento)
router.get('/documentos/:idItem/url-descarga', jwtMiddleware(), bffControlador.obtenerUrlDescargaDocumento)

// ── ACTIVIDADES INTERACTIVAS ──────────────────────────────────
router.put('/actividades/:idItem', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), bffControlador.actualizarActividad)

// ── USUARIOS (admin) ──────────────────────────────────────────
router.get('/usuarios', jwtMiddleware(['ADMIN']), bffControlador.listarUsuarios)
router.patch('/usuarios/:id/rol', jwtMiddleware(['ADMIN']), bffControlador.cambiarRolUsuario)

// ── FLUJOS ORQUESTADOS ────────────────────────────────────────
// Iniciar intento: BFF obtiene preguntas de cursos-servicio + crea intento en progreso-servicio
router.post('/intentos/iniciar', jwtMiddleware(['ESTUDIANTE']), bffControlador.iniciarIntentoQuiz)
    // Registrar respuestas: BFF valida correctas en cursos-servicio + guarda en progreso-servicio
router.post('/intentos/:id/respuestas', jwtMiddleware(['ESTUDIANTE']), bffControlador.registrarRespuestasIntento)

export default router