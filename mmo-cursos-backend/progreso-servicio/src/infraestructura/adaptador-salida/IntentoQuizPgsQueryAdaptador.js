import IntentoQuizSalidaQueryPuerto from '../../aplicacion/puertos/salida/IntentoQuizSalidaQueryPuerto.js'
import ModeloIntentoQuiz from '../modelos/ModeloIntentoQuiz.js'
import ModeloRespuestaIntento from '../modelos/ModeloRespuestaIntento.js'

export default class IntentoQuizPgsQueryAdaptador extends IntentoQuizSalidaQueryPuerto {

    obtenerPorId = async(id) => {
        try {
            const intento = await ModeloIntentoQuiz.findByPk(id)
            if (!intento || intento.deletedAt !== null) return { estado: 'error', resultado: null }

            const respuestas = await ModeloRespuestaIntento.findAll({ where: { id_intento: id, deletedAt: null } })
            return { estado: 'ok', resultado: {...intento.toJSON(), respuestas: respuestas.map(r => r.toJSON()) } }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}