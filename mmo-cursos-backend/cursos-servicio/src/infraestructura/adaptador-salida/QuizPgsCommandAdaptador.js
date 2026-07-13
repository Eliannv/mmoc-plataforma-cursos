import QuizSalidaCommandPuerto from '../../aplicacion/puertos/salida/QuizSalidaCommandPuerto.js'
import ModeloPregunta, { sequelize } from '../modelos/ModeloPregunta.js'
import ModeloOpcionPregunta from '../modelos/ModeloOpcionPregunta.js'
import { Transaction } from 'sequelize'

export default class QuizPgsCommandAdaptador extends QuizSalidaCommandPuerto {

    agregarPregunta = async(pregunta, opciones = []) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const creada = await ModeloPregunta.create({
                id_quiz: pregunta.getIdQuiz(),
                enunciado: pregunta.getEnunciado(),
                orden: pregunta.getOrden()
            }, { transaction })

            const opcionesCreadas = await Promise.all(
                opciones.map(o => ModeloOpcionPregunta.create({
                    id_pregunta: creada.id,
                    texto: o.getTexto(),
                    es_correcta: o.getEsCorrecta()
                }, { transaction }))
            )

            await transaction.commit()
            console.log('✓ Pregunta agregada al quiz')
            return {
                estado: 'ok',
                pregunta: {...creada.toJSON(), opciones: opcionesCreadas.map(o => o.toJSON()) }
            }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    eliminarPregunta = async(idPregunta) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrada = await ModeloPregunta.findByPk(idPregunta, { transaction })
            if (!encontrada || encontrada.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Pregunta no encontrada' }
            }
            // Soft delete de la pregunta y sus opciones
            await encontrada.update({ deletedAt: new Date() }, { transaction })
            await ModeloOpcionPregunta.update({ deletedAt: new Date() }, { where: { id_pregunta: idPregunta }, transaction })
            await transaction.commit()
            return { estado: 'ok', resultado: 'Pregunta eliminada correctamente' }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}