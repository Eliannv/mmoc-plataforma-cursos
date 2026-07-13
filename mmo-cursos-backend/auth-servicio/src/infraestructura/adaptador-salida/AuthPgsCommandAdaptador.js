import AuthSalidaCommandPuerto from '../../aplicacion/puertos/salida/AuthSalidaCommandPuerto.js'
import ModeloUsuario, { sequelize } from '../modelos/ModeloUsuario.js'
import { Transaction } from 'sequelize'

export default class AuthPgsCommandAdaptador extends AuthSalidaCommandPuerto {

    guardar = async(usuario) => {
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        })
        try {
            const creado = await ModeloUsuario.create({
                nombre: usuario.getNombre(),
                correo: usuario.getCorreo(),
                contrasena: usuario.getContrasena(),
                rol: usuario.getRol(),
                estado: usuario.getEstado()
            }, { transaction })

            await transaction.commit()
            console.log('✓ Usuario guardado en la base de datos')
            return {
                estado: 'ok',
                id: creado.id,
                nombre: creado.nombre,
                correo: creado.correo,
                rol: creado.rol,
                estado: creado.estado
            }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    verificarCorreoExiste = async(correo) => {
        const usuario = await ModeloUsuario.findOne({ where: { correo, deletedAt: null } })
        return !!usuario
    }

    cambiarRol = async(id, rol) => {
        const transaction = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
        })
        try {
            const usuario = await ModeloUsuario.findByPk(id, { transaction })
            if (!usuario || usuario.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Usuario no encontrado' }
            }
            await usuario.update({ rol }, { transaction })
            await transaction.commit()
            console.log(`✓ Rol de usuario ${id} cambiado a ${rol}`)
            return { estado: 'ok', id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}