import ProgresoSalidaCommandPuerto from '../../aplicacion/puertos/salida/ProgresoSalidaCommandPuerto.js'
import ModeloProgresoContenido, { sequelize } from '../modelos/ModeloProgresoContenido.js'
import { Transaction } from 'sequelize'

export default class ProgresoPgsCommandAdaptador extends ProgresoSalidaCommandPuerto {

    marcarOCrear = async(idInscripcion, idItemContenido, segundosVistos = null) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const [progreso, creado] = await ModeloProgresoContenido.findOrCreate({
                where: { id_inscripcion: idInscripcion, id_item_contenido: idItemContenido, deletedAt: null },
                defaults: {
                    id_inscripcion: idInscripcion,
                    id_item_contenido: idItemContenido,
                    completado: true,
                    segundos_vistos: segundosVistos || 0,
                    fecha_completado: new Date()
                },
                transaction
            })

            if (!creado) {
                // Ya existía — actualizar completado y segundos si el nuevo valor es mayor
                const updates = { completado: true, fecha_completado: new Date() }
                if (segundosVistos !== null && segundosVistos > (progreso.segundos_vistos || 0)) {
                    updates.segundos_vistos = segundosVistos
                }
                await progreso.update(updates, { transaction })
            }

            await transaction.commit()
            console.log('✓ Progreso de contenido registrado')
            return { estado: 'ok', ...progreso.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}