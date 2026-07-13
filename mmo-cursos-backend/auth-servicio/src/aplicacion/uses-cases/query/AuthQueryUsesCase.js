import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class AuthQueryUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async login(dtoUsuario) {
        const respuesta = await this.adaptadorBDSalida.obtenerPorCorreo(dtoUsuario.getCorreo())
        if (respuesta.estado === 'error' || !respuesta.resultado) {
            return { estado: 'error', resultado: 'Credenciales inválidas' }
        }

        const usuario = respuesta.resultado
        const contrasenaValida = await bcrypt.compare(dtoUsuario.getContrasena(), usuario.contrasena)
        if (!contrasenaValida) {
            return { estado: 'error', resultado: 'Credenciales inválidas' }
        }

        if (usuario.estado === 'INACTIVO') {
            return { estado: 'error', resultado: 'La cuenta está inactiva' }
        }

        const payload = { id: usuario.id, correo: usuario.correo, rol: usuario.rol, nombre: usuario.nombre }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'mmo_jwt_secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        })

        console.log('Login exitoso en caso de uso')
        return {
            estado: 'ok',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
        }
    }

    async obtenerPerfil(id) {
        const respuesta = await this.adaptadorBDSalida.obtenerPorId(id)
        if (respuesta.estado === 'error' || !respuesta.resultado) {
            return { estado: 'error', resultado: 'Usuario no encontrado' }
        }
        const u = respuesta.resultado
        return {
            estado: 'ok',
            resultado: { id: u.id, nombre: u.nombre, correo: u.correo, rol: u.rol, estado: u.estado }
        }
    }

    async listarUsuarios(filtros) {
        const resultado = await this.adaptadorBDSalida.listarUsuarios(filtros)
        console.log('Listado de usuarios ejecutado en caso de uso')
        return resultado
    }
}