import { httpClient, desEnvolver } from '../http/cliente'
import type { IVideosPort, IDocumentosPort, IActividadesPort, IQuizzesPort } from '../../domain/puertos'
import type { Video, Documento, ActividadInteractiva, Quiz, Pregunta } from '../../domain/entidades'

export const videosAdaptador: IVideosPort = {
  async solicitarUrlSubida(idItem) {
    return desEnvolver<{ url_subida: string; key: string }>(
      await httpClient.get(`/videos/${idItem}/url-subida`)
    )
  },
  async confirmarSubida(idItem) {
    return desEnvolver<Video>(await httpClient.post(`/videos/${idItem}/confirmar`))
  },
  async obtenerUrlDescarga(idItem) {
    return desEnvolver<{ url_descarga: string }>(
      await httpClient.get(`/videos/${idItem}/url-descarga`)
    )
  },
}

export const documentosAdaptador: IDocumentosPort = {
  async solicitarUrlSubida(idItem, params) {
    return desEnvolver<{ url_subida: string; key: string }>(
      await httpClient.get(`/documentos/${idItem}/url-subida`, { params })
    )
  },
  async confirmarSubida(idItem, nombreArchivo) {
    return desEnvolver<Documento>(
      await httpClient.post(`/documentos/${idItem}/confirmar`, { nombre_archivo: nombreArchivo })
    )
  },
  async obtenerUrlDescarga(idItem) {
    return desEnvolver<{ url_descarga: string; nombre_archivo?: string }>(
      await httpClient.get(`/documentos/${idItem}/url-descarga`)
    )
  },
}

export const actividadesAdaptador: IActividadesPort = {
  async actualizar(idItem, tipo, config) {
    return desEnvolver<ActividadInteractiva>(
      await httpClient.put(`/actividades/${idItem}`, { tipo, config })
    )
  },
}

export const quizzesAdaptador: IQuizzesPort = {
  async obtenerConPreguntas(idQuiz) {
    return desEnvolver<Quiz>(await httpClient.get(`/quizzes/${idQuiz}/preguntas`))
  },
  async agregarPregunta(idQuiz, datos) {
    return desEnvolver<Pregunta>(await httpClient.post(`/quizzes/${idQuiz}/preguntas`, datos))
  },
  async eliminarPregunta(idQuiz, idPregunta) {
    await httpClient.delete(`/quizzes/${idQuiz}/preguntas/${idPregunta}`)
  },
}
