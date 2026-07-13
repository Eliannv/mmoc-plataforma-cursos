import InscripcionSalidaCommandPuerto from '../../aplicacion/puertos/salida/InscripcionSalidaCommandPuerto.js'
import ModeloInscripcion, { sequelize } from '../modelos/ModeloInscripcion.js'
import { Transaction } from 'sequelize'

export default class InscripcionPgsCommandAdaptador extends InscripcionSalidaCommandPuerto {

    guardar = async(inscripcion) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const creada = await ModeloInscripcion.create({
                id_usuario: inscripcion.getIdUsuario(),
                id_curso: inscripcion.getIdCurso(),
                fecha_inscripcion: inscripcion.getFechaInscripcion(),
                estado: inscripcion.getEstado()
            }, { transaction })
            await transaction.commit()
            console.log('✓ Inscripción guardada en la base de datos')
            return { estado: 'ok', ...creada.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}