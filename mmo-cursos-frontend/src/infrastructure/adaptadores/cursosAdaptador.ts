import { httpClient, desEnvolver } from '../http/cliente'
import type { ICategoriasPort, ICursosPort, ISeccionesPort, IItemsPort } from '../../domain/puertos'
import type { Categoria, Curso, Seccion, ItemContenido } from '../../domain/entidades'

export const categoriasAdaptador: ICategoriasPort = {
  async listar() {
    return desEnvolver<Categoria[]>(await httpClient.get('/categorias'))
  },
  async obtener(id) {
    return desEnvolver<Categoria>(await httpClient.get(`/categorias/${id}`))
  },
  async crear(datos) {
    return desEnvolver<Categoria>(await httpClient.post('/categorias', datos))
  },
  async actualizar(id, datos) {
    return desEnvolver<Categoria>(await httpClient.put(`/categorias/${id}`, datos))
  },
  async eliminar(id) {
    await httpClient.delete(`/categorias/${id}`)
  },
}

export const cursosAdaptador: ICursosPort = {
  async listar(params) {
    return desEnvolver<Curso[]>(await httpClient.get('/cursos', { params }))
  },
  async listarPorCategoria(idCategoria) {
    return desEnvolver<Curso[]>(await httpClient.get(`/cursos/categoria/${idCategoria}`))
  },
  async obtener(id) {
    return desEnvolver<Curso>(await httpClient.get(`/cursos/${id}`))
  },
  async obtenerPublico(id) {
    return desEnvolver<Curso>(await httpClient.get(`/cursos/publico/${id}`))
  },
  async listarPublicos(params) {
    return desEnvolver<Curso[]>(await httpClient.get('/cursos/publicos', { params }))
  },
  async crear(datos) {
    return desEnvolver<Curso>(await httpClient.post('/cursos', datos))
  },
  async actualizar(id, datos) {
    return desEnvolver<Curso>(await httpClient.put(`/cursos/${id}`, datos))
  },
  async eliminar(id) {
    await httpClient.delete(`/cursos/${id}`)
  },
  async publicar(id) {
    return desEnvolver<Curso>(await httpClient.put(`/cursos/${id}/publicar`))
  },
  async despublicar(id) {
    return desEnvolver<Curso>(await httpClient.put(`/cursos/${id}/despublicar`))
  },
}

export const seccionesAdaptador: ISeccionesPort = {
  async listar(idCurso) {
    return desEnvolver<Seccion[]>(await httpClient.get(`/cursos/${idCurso}/secciones`))
  },
  async crear(idCurso, datos) {
    return desEnvolver<Seccion>(await httpClient.post(`/cursos/${idCurso}/secciones`, datos))
  },
  async actualizar(id, datos) {
    return desEnvolver<Seccion>(await httpClient.put(`/secciones/${id}`, datos))
  },
  async eliminar(id) {
    await httpClient.delete(`/secciones/${id}`)
  },
}

export const itemsAdaptador: IItemsPort = {
  async listar(idSeccion) {
    return desEnvolver<ItemContenido[]>(await httpClient.get(`/secciones/${idSeccion}/items`))
  },
  async crear(idSeccion, datos) {
    return desEnvolver<ItemContenido>(await httpClient.post(`/secciones/${idSeccion}/items`, datos))
  },
  async actualizar(id, datos) {
    return desEnvolver<ItemContenido>(await httpClient.put(`/items/${id}`, datos))
  },
  async eliminar(id) {
    await httpClient.delete(`/items/${id}`)
  },
}
