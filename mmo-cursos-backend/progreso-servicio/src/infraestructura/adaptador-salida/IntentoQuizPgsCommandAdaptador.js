import IntentoQuizSalidaCommandPuerto from '../../aplicacion/puertos/salida/IntentoQuizSalidaCommandPuerto.js'
import ModeloIntentoQuiz, { sequelize } from '../modelos/ModeloIntentoQuiz.js'
import ModeloRespuestaIntento from '../modelos/ModeloRespuestaIntento.js'
import { Transaction } from 'sequelize'

export default class IntentoQuizPgsCommandAdaptador extends IntentoQuizSalidaCommandPuerto {

    iniciar = async(intentoQuiz) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const creado = await ModeloIntentoQuiz.create({
                id_inscripcion: intentoQuiz.getIdInscripcion(),
                id_quiz: intentoQuiz.getIdQuiz(),
                preguntas_seleccionadas: intentoQuiz.getPreguntasSeleccionadas(),
                completado: false,
                fecha_inicio: intentoQuiz.getFechaInicio()
            }, { transaction })
            await transaction.commit()
            console.log('✓ Intento de quiz iniciado en la base de datos')
            return { estado: 'ok', ...creado.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    // respuestas: Array de { id_pregunta, id_opcion_seleccionada, es_correcta }
    registrarRespuestasYCalcularPuntaje = async(idIntento, respuestas = []) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const intento = await ModeloIntentoQuiz.findByPk(idIntento, { transaction })
            if (!intento || intento.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Intento no encontrado' }
            }
            if (intento.completado) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Este intento ya fue completado' }
            }

            // Registrar respuestas
            await Promise.all(
                respuestas.map(r => ModeloRespuestaIntento.create({
                    id_intento: idIntento,
                    id_pregunta: r.id_pregunta,
                    id_opcion_seleccionada: r.id_opcion_seleccionada,
                    es_correcta: r.es_correcta || false
                }, { transaction }))
            )

            // Calcular puntaje
            const correctas = respuestas.filter(r => r.es_correcta === true).length
            const puntaje = Math.round((correctas / respuestas.length) * 100)

            await intento.update({ puntaje, completado: true, fecha_fin: new Date() }, { transaction })
            await transaction.commit()

            console.log(`✓ Intento ${idIntento} completado con puntaje ${puntaje}`)
            return { estado: 'ok', id: idIntento, puntaje, correctas, total: respuestas.length }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}