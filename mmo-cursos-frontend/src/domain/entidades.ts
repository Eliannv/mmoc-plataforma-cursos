// Refleja exactamente los esquemas del contrato OpenAPI del backend

export type Rol = 'ADMIN' | 'INSTRUCTOR' | 'ESTUDIANTE'
export type EstadoCurso = 'BORRADOR' | 'PUBLICADO' | 'INACTIVO'
export type NivelCurso = 'BASICO' | 'INTERMEDIO'
export type TipoItem = 'VIDEO' | 'DOCUMENTO' | 'ACTIVIDAD_INTERACTIVA' | 'QUIZ'
export type EstadoVideo = 'PENDIENTE' | 'PROCESANDO' | 'LISTO' | 'FALLIDO'
export type TipoActividad = 'escenario_decision' | 'verdadero_falso' | 'reflexion_abierta'
export type EstadoInscripcion = 'ACTIVA' | 'COMPLETADA' | 'CANCELADA'

export interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: Rol
  estado?: 'ACTIVO' | 'INACTIVO'
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  estado?: 'ACTIVO' | 'INACTIVO'
}

export interface Curso {
  id: number
  titulo: string
  descripcion?: string
  nivel: NivelCurso
  estado: EstadoCurso
  id_categoria: number
  id_instructor?: number
  duracion_total_minutos?: number
  categoria?: Categoria
  secciones?: Seccion[]
}

export interface Seccion {
  id: number
  id_curso: number
  titulo: string
  orden: number
  items?: ItemContenido[]
}

export interface ItemContenido {
  id: number
  id_seccion: number
  titulo: string
  tipo: TipoItem
  orden: number
  video?: Video
  documento?: Documento
  actividad_interactiva?: ActividadInteractiva
  quiz?: Quiz
}

export interface Video {
  id: number
  id_item: number
  storage_key?: string
  duracion_segundos?: number
  estado_procesamiento: EstadoVideo
}

export interface Documento {
  id: number
  id_item: number
  storage_key?: string
  nombre_archivo?: string
}

// Config shapes por tipo de actividad
export interface ConfigEscenarioDecision {
  situacion: string
  opciones: { texto: string; retroalimentacion: string }[]
}
export interface ConfigVerdaderoFalso {
  enunciado: string
  es_verdadero: boolean
  explicacion: string
}
export interface ConfigReflexionAbierta {
  pregunta: string
  guia_respuesta?: string
}

export interface ActividadInteractiva {
  id: number
  id_item: number
  tipo?: TipoActividad
  config?: ConfigEscenarioDecision | ConfigVerdaderoFalso | ConfigReflexionAbierta
}

export interface OpcionPregunta {
  id: number
  id_pregunta: number
  texto: string
  // es_correcta NO se expone al estudiante; el BFF lo retira antes de responder
}

export interface Pregunta {
  id: number
  id_quiz: number
  enunciado: string
  orden?: number
  opciones: OpcionPregunta[]
}

export interface Quiz {
  id: number
  id_item: number
  instrucciones?: string
  preguntas?: Pregunta[]
}

export interface Inscripcion {
  id: number
  id_curso: number
  id_usuario?: number
  estado: EstadoInscripcion
  fecha_inscripcion?: string
  curso?: Curso
}

export interface ProgresoItem {
  id: number
  id_inscripcion: number
  id_item_contenido: number
  completado: boolean
  segundos_vistos?: number
  fecha_completado?: string
}

export interface ProgresoCurso {
  id_inscripcion: number
  total_items: number
  completados: number
  porcentaje: number
  ultimo_item_visto?: number
  items?: ProgresoItem[]
}

export interface IntentoQuiz {
  id: number
  id_inscripcion: number
  id_quiz: number
  preguntas_seleccionadas: number[]
  puntaje?: number
  completado: boolean
  fecha_inicio: string
  fecha_fin?: string
}

export interface RespuestaIntento {
  id_pregunta: number
  id_opcion_seleccionada: number
}

export interface ResultadoIntento {
  id: number
  puntaje: number
  correctas: number
  total: number
}
