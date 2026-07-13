import ModeloActividadInteractiva, { sequelize } from '../modelos/ModeloActividadInteractiva.js'
import { Transaction } from 'sequelize'

export default class ActividadPgsCommandAdaptador {

    guardarConfig = async(idItem, tipo, config) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const actividad = await ModeloActividadInteractiva.findOne({ where: { id_item: idItem, deletedAt: null }, transaction })
            if (!actividad) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Actividad interactiva no encontrada para este ítem' }
            }
            await actividad.update({ tipo, config }, { transaction })
            await transaction.commit()
            console.log(`✓ Config de actividad ${idItem} guardada (tipo: ${tipo})`)
            return { estado: 'ok', ...actividad.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}