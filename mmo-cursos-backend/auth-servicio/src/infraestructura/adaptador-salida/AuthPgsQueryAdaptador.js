import AuthSalidaQueryPuerto from '../../aplicacion/puertos/salida/AuthSalidaQueryPuerto.js'
import ModeloUsuario from '../modelos/ModeloUsuario.js'
import { Op } from 'sequelize'

export default class AuthPgsQueryAdaptador extends AuthSalidaQueryPuerto {

    obtenerPorCorreo = async(correo) => {
        try {
            const usuario = await ModeloUsuario.findOne({ where: { correo, deletedAt: null } })
            if (!usuario) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: usuario }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }

    obtenerPorId = async(id) => {
        try {
            const usuario = await ModeloUsuario.findByPk(id)
            if (!usuario || usuario.deletedAt !== null) {
                return { estado: 'error', resultado: null }
            }
            return { estado: 'ok', resultado: usuario }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }

    listarUsuarios = async({ pagina = 1, limite = 20, rol } = {}) => {
        try {
            const where = { deletedAt: null }
            if (rol) where.rol = rol

            const offset = (pagina - 1) * limite
            const { count, rows } = await ModeloUsuario.findAndCountAll({
                where,
                limit: parseInt(limite),
                offset: parseInt(offset),
                order: [
                    ['id', 'ASC']
                ],
                attributes: ['id', 'nombre', 'correo', 'rol', 'estado']
            })

            return {
                estado: 'ok',
                resultado: rows,
                total: count,
                pagina: parseInt(pagina),
                limite: parseInt(limite),
                paginas: Math.ceil(count / limite)
            }
        } catch (error) {
            return { estado: 'error', resultado: error.message }
        }
    }
}