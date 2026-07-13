// Puertos de salida: contratos que la capa de infraestructura debe implementar

import type {
  Usuario, Categoria, Curso, Seccion, ItemContenido, Video, Documento, Quiz,
  Pregunta, Inscripcion, ProgresoCurso, ProgresoItem, IntentoQuiz, ResultadoIntento,
  Rol, NivelCurso, TipoItem, TipoActividad, RespuestaIntento,
  ConfigEscenarioDecision, ConfigVerdaderoFalso, ConfigReflexionAbierta, ActividadInteractiva
} from './entidades'

// ── Respuesta genérica envolvente del backend ──────────────────
export interface ApiResponse<T> {
  data: T
  message: string
  meta: { traceId: string; timestamp: string; path: string }
  links?: { self: string }
}

export interface ApiError {
  error: { code: string; message: string; details: string[] }
  meta: { traceId: string; timestamp: string; path: string }
}

// ── Auth ───────────────────────────────────────────────────────
export interface IAuthPort {
  login(correo: string, contrasena: string): Promise<{ token: string; usuario: Usuario }>
  registro(datos: { nombre: string; correo: string; contrasena: string; rol?: Rol }): Promise<Usuario>
  perfil(token: string): Promise<Usuario>
}

// ── Usuarios (admin) ───────────────────────────────────────────
export interface IUsuariosPort {
  listar(params: { pagina?: number; limite?: number; rol?: Rol }): Promise<{ usuarios: Usuario[]; total: number; paginas: number }>
  cambiarRol(id: number, rol: Rol): Promise<Usuario>
}

// ── Categorías ─────────────────────────────────────────────────
export interface ICategoriasPort {
  listar(): Promise<Categoria[]>
  obtener(id: number): Promise<Categoria>
  crear(datos: { nombre: string; descripcion?: string }): Promise<Categoria>
  actualizar(id: number, datos: Partial<Categoria>): Promise<Categoria>
  eliminar(id: number): Promise<void>
}

// ── Cursos ─────────────────────────────────────────────────────
export interface ICursosPort {
  listar(params?: { id_categoria?: number; estado?: string }): Promise<Curso[]>
  listarPorCategoria(idCategoria: number): Promise<Curso[]>
  obtener(id: number): Promise<Curso>
  obtenerPublico(id: number): Promise<Curso>
  listarPublicos(params?: { id_categoria?: number }): Promise<Curso[]>
  crear(datos: { titulo: string; descripcion?: string; nivel: NivelCurso; id_categoria: number }): Promise<Curso>
  actualizar(id: number, datos: Partial<Curso>): Promise<Curso>
  eliminar(id: number): Promise<void>
  publicar(id: number): Promise<Curso>
  despublicar(id: number): Promise<Curso>
}

// ── Secciones ──────────────────────────────────────────────────
export interface ISeccionesPort {
  listar(idCurso: number): Promise<Seccion[]>
  crear(idCurso: number, datos: { titulo: string; orden?: number }): Promise<Seccion>
  actualizar(id: number, datos: Partial<Seccion>): Promise<Seccion>
  eliminar(id: number): Promise<void>
}

// ── Items de contenido ─────────────────────────────────────────
export interface IItemsPort {
  listar(idSeccion: number): Promise<ItemContenido[]>
  crear(idSeccion: number, datos: { titulo: string; tipo: TipoItem; orden?: number }): Promise<ItemContenido>
  actualizar(id: number, datos: Partial<ItemContenido>): Promise<ItemContenido>
  eliminar(id: number): Promise<void>
}

// ── Videos ─────────────────────────────────────────────────────
export interface IVideosPort {
  solicitarUrlSubida(idItem: number): Promise<{ url_subida: string; key: string }>
  confirmarSubida(idItem: number): Promise<Video>
  obtenerUrlDescarga(idItem: number): Promise<{ url_descarga: string }>
}

// ── Documentos ─────────────────────────────────────────────────
export interface IDocumentosPort {
  solicitarUrlSubida(idItem: number, params: { nombre_archivo?: string; content_type?: string }): Promise<{ url_subida: string; key: string }>
  confirmarSubida(idItem: number, nombreArchivo: string): Promise<Documento>
  obtenerUrlDescarga(idItem: number): Promise<{ url_descarga: string; nombre_archivo?: string }>
}

// ── Actividades interactivas ───────────────────────────────────
export interface IActividadesPort {
  actualizar(idItem: number, tipo: TipoActividad, config: ConfigEscenarioDecision | ConfigVerdaderoFalso | ConfigReflexionAbierta): Promise<ActividadInteractiva>
}

// ── Quizzes ────────────────────────────────────────────────────
export interface IQuizzesPort {
  obtenerConPreguntas(idQuiz: number): Promise<Quiz>
  agregarPregunta(idQuiz: number, datos: { enunciado: string; opciones: { texto: string; es_correcta: boolean }[] }): Promise<Pregunta>
  eliminarPregunta(idQuiz: number, idPregunta: number): Promise<void>
}

// ── Inscripciones ──────────────────────────────────────────────
export interface IInscripcionesPort {
  inscribirse(idCurso: number): Promise<Inscripcion>
  listarMias(): Promise<Inscripcion[]>
  obtenerProgreso(idCurso: number): Promise<ProgresoCurso>
}

// ── Progreso ───────────────────────────────────────────────────
export interface IProgresoPort {
  marcarAvance(datos: { id_inscripcion: number; id_item_contenido: number; segundos_vistos?: number }): Promise<ProgresoItem>
}

// ── Intentos de quiz ───────────────────────────────────────────
export interface IIntentosPort {
  iniciar(datos: { id_inscripcion: number; id_quiz: number }): Promise<{ intento: IntentoQuiz; preguntas: Pregunta[] }>
  registrarRespuestas(id: number, datos: { respuestas: RespuestaIntento[]; id_quiz: number }): Promise<ResultadoIntento>
}
