import CategoriaSalidaCommandPuerto from '../../aplicacion/puertos/salida/CategoriaSalidaCommandPuerto.js'
import ModeloCategoria, { sequelize } from '../modelos/ModeloCategoria.js'
import { Transaction } from 'sequelize'

export default class CategoriaPgsCommandAdaptador extends CategoriaSalidaCommandPuerto {

    guardar = async(categoria) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const creada = await ModeloCategoria.create({
                nombre: categoria.getNombre(),
                descripcion: categoria.getDescripcion(),
                estado: categoria.getEstado()
            }, { transaction })
            await transaction.commit()
            console.log('✓ Categoría guardada en la base de datos')
            return { estado: 'ok', id: creada.id, nombre: creada.nombre, descripcion: creada.descripcion, estado: creada.estado }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    editar = async(categoria, datosProvistos = {}) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrada = await ModeloCategoria.findByPk(categoria.getId(), { transaction })
            if (!encontrada || encontrada.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Categoría no encontrada' }
            }
            const cambios = {}
            if (datosProvistos.hasOwnProperty('nombre')) cambios.nombre = categoria.getNombre()
            if (datosProvistos.hasOwnProperty('descripcion')) cambios.descripcion = categoria.getDescripcion()
            if (datosProvistos.hasOwnProperty('estado')) cambios.estado = categoria.getEstado()
            await encontrada.update(cambios, { transaction })
            await transaction.commit()
            return { estado: 'ok', id: encontrada.id, nombre: encontrada.nombre, descripcion: encontrada.descripcion, estado: encontrada.estado }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    eliminar = async(dto) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrada = await ModeloCategoria.findByPk(dto.getId(), { transaction })
            if (!encontrada || encontrada.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Categoría no encontrada' }
            }
            await encontrada.update({ deletedAt: new Date() }, { transaction })
            await transaction.commit()
            return { estado: 'ok', resultado: 'Categoría eliminada correctamente' }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}