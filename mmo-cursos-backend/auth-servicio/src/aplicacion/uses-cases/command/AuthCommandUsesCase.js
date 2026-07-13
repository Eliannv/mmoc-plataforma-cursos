import bcrypt from 'bcrypt'
import Usuario from '../../../dominio/entidades/Usuario.js'

export default class AuthCommandUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async registrar(dtoUsuario) {
        const correoExistente = await this.adaptadorBDSalida.verificarCorreoExiste(dtoUsuario.getCorreo())
        if (correoExistente) {
            return { estado: 'error', resultado: 'El correo ya está registrado en el sistema' }
        }

        const hashContrasena = await bcrypt.hash(dtoUsuario.getContrasena(), 10)
        const usuario = new Usuario(
            null,
            dtoUsuario.getNombre(),
            dtoUsuario.getCorreo(),
            hashContrasena,
            dtoUsuario.getRol(),
            dtoUsuario.getEstado()
        )

        const resultado = await this.adaptadorBDSalida.guardar(usuario)
        console.log('Usuario registrado en caso de uso')
        return resultado
    }

    async cambiarRol(id, rol) {
        const resultado = await this.adaptadorBDSalida.cambiarRol(id, rol)
        console.log('Cambio de rol ejecutado en caso de uso')
        return resultado
    }
}