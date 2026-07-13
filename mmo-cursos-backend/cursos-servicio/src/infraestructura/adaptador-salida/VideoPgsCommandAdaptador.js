import VideoSalidaCommandPuerto from '../../aplicacion/puertos/salida/VideoSalidaCommandPuerto.js'
import ModeloVideo, { sequelize } from '../modelos/ModeloVideo.js'
import { Transaction } from 'sequelize'

export default class VideoPgsCommandAdaptador extends VideoSalidaCommandPuerto {

    asignarStorageKey = async(idItem, storageKey) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const video = await ModeloVideo.findOne({ where: { id_item: idItem, deletedAt: null }, transaction })
            if (!video) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Video no encontrado' }
            }
            await video.update({ storage_key: storageKey }, { transaction })
            await transaction.commit()
            console.log(`✓ storage_key asignada al video item ${idItem}: ${storageKey}`)
            return { estado: 'ok', ...video.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    confirmarVideo = async(idItem, duracionSegundos, estadoProcesamiento) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const video = await ModeloVideo.findOne({ where: { id_item: idItem, deletedAt: null }, transaction })
            if (!video) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Video no encontrado' }
            }
            await video.update({ duracion_segundos: duracionSegundos, estado_procesamiento: estadoProcesamiento }, { transaction })
            await transaction.commit()
            console.log(`✓ Video item ${idItem} actualizado: duracion=${duracionSegundos}s, estado=${estadoProcesamiento}`)
            return { estado: 'ok', ...video.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}