import SeccionSalidaCommandPuerto from '../../aplicacion/puertos/salida/SeccionSalidaCommandPuerto.js'
import ModeloSeccion, { sequelize } from '../modelos/ModeloSeccion.js'
import { Transaction } from 'sequelize'

export default class SeccionPgsCommandAdaptador extends SeccionSalidaCommandPuerto {

    guardar = async(seccion) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const creada = await ModeloSeccion.create({
                id_curso: seccion.getIdCurso(),
                titulo: seccion.getTitulo(),
                orden: seccion.getOrden()
            }, { transaction })
            await transaction.commit()
            return { estado: 'ok', ...creada.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    editar = async(seccion, datosProvistos = {}) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrada = await ModeloSeccion.findByPk(seccion.getId(), { transaction })
            if (!encontrada || encontrada.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Sección no encontrada' }
            }
            const cambios = {}
            if (datosProvistos.hasOwnProperty('titulo')) cambios.titulo = seccion.getTitulo()
            if (datosProvistos.hasOwnProperty('orden')) cambios.orden = seccion.getOrden()
            await encontrada.update(cambios, { transaction })
            await transaction.commit()
            return { estado: 'ok', ...encontrada.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    eliminar = async(dto) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrada = await ModeloSeccion.findByPk(dto.getId(), { transaction })
            if (!encontrada || encontrada.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Sección no encontrada' }
            }
            await encontrada.update({ deletedAt: new Date() }, { transaction })
            await transaction.commit()
            return { estado: 'ok', resultado: 'Sección eliminada correctamente' }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}