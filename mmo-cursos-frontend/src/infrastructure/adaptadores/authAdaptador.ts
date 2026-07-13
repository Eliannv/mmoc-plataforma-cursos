import { httpClient, desEnvolver } from '../http/cliente'
import type { IAuthPort } from '../../domain/puertos'
import type { Usuario } from '../../domain/entidades'

export const authAdaptador: IAuthPort = {
  async login(correo, contrasena) {
    const resp = await httpClient.post('/auth/login', { correo, contrasena })
    return resp.data.data as { token: string; usuario: Usuario }
  },

  async registro(datos) {
    return desEnvolver<Usuario>(await httpClient.post('/auth/registro', datos))
  },

  async perfil() {
    return desEnvolver<Usuario>(await httpClient.get('/auth/perfil'))
  },
}
