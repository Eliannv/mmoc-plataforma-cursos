import { httpClient, desEnvolver } from '../http/cliente'
import type { IUsuariosPort } from '../../domain/puertos'
import type { Usuario } from '../../domain/entidades'

interface UsuariosResponse {
  data: Usuario[]
  total?: number
  paginas?: number
}

export const usuariosAdaptador: IUsuariosPort = {
  async listar(params) {
    const resp = await httpClient.get('/usuarios', { params })
    const body = resp.data.data as Usuario[]
    const meta = resp.data as UsuariosResponse
    return { usuarios: body, total: meta.total ?? body.length, paginas: meta.paginas ?? 1 }
  },
  async cambiarRol(id, rol) {
    return desEnvolver<Usuario>(await httpClient.patch(`/usuarios/${id}/rol`, { rol }))
  },
}
