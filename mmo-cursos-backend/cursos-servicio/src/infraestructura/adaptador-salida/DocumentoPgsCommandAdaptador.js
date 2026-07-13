import DocumentoSalidaCommandPuerto from '../../aplicacion/puertos/salida/DocumentoSalidaCommandPuerto.js'
import ModeloDocumento, { sequelize } from '../modelos/ModeloDocumento.js'
import { Transaction } from 'sequelize'

export default class DocumentoPgsCommandAdaptador extends DocumentoSalidaCommandPuerto {

    guardarStorageKey = async(idItem, storageKey, nombreArchivo) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const doc = await ModeloDocumento.findOne({ where: { id_item: idItem, deletedAt: null }, transaction })
            if (!doc) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Documento no encontrado' }
            }
            await doc.update({ storage_key: storageKey, nombre_archivo: nombreArchivo }, { transaction })
            await transaction.commit()
            console.log(`✓ storage_key de documento guardado: ${storageKey}`)
            return { estado: 'ok', ...doc.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}