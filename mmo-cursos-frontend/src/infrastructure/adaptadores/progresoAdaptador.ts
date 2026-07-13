import { httpClient, desEnvolver } from '../http/cliente'
import type { IInscripcionesPort, IProgresoPort, IIntentosPort } from '../../domain/puertos'
import type { Inscripcion, ProgresoCurso, ProgresoItem, IntentoQuiz, Pregunta, ResultadoIntento } from '../../domain/entidades'

export const inscripcionesAdaptador: IInscripcionesPort = {
  async inscribirse(idCurso) {
    return desEnvolver<Inscripcion>(await httpClient.post('/inscripciones', { id_curso: idCurso }))
  },
  async listarMias() {
    return desEnvolver<Inscripcion[]>(await httpClient.get('/inscripciones'))
  },
  async obtenerProgreso(idCurso) {
    return desEnvolver<ProgresoCurso>(
      await httpClient.get(`/inscripciones/cursos/${idCurso}/progreso`)
    )
  },
}

export const progresoAdaptador: IProgresoPort = {
  async marcarAvance(datos) {
    return desEnvolver<ProgresoItem>(await httpClient.post('/progreso', datos))
  },
}

export const intentosAdaptador: IIntentosPort = {
  async iniciar(datos) {
    return desEnvolver<{ intento: IntentoQuiz; preguntas: Pregunta[] }>(
      await httpClient.post('/intentos/iniciar', datos)
    )
  },
  async registrarRespuestas(id, datos) {
    return desEnvolver<ResultadoIntento>(
      await httpClient.post(`/intentos/${id}/respuestas`, datos)
    )
  },
}
