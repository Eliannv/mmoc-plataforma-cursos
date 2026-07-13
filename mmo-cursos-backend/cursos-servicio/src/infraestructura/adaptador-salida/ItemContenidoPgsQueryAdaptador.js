import ItemContenidoSalidaQueryPuerto from '../../aplicacion/puertos/salida/ItemContenidoSalidaQueryPuerto.js'
import ModeloItemContenido from '../modelos/ModeloItemContenido.js'
import ModeloVideo from '../modelos/ModeloVideo.js'
import ModeloDocumento from '../modelos/ModeloDocumento.js'
import ModeloActividadInteractiva from '../modelos/ModeloActividadInteractiva.js'
import ModeloQuiz from '../modelos/ModeloQuiz.js'

export default class ItemContenidoPgsQueryAdaptador extends ItemContenidoSalidaQueryPuerto {

    listarPorSeccion = async(idSeccion) => {
        const items = await ModeloItemContenido.findAll({
            where: { id_seccion: idSeccion, deletedAt: null },
            order: [
                ['orden', 'ASC']
            ]
        })
        return { estado: 'ok', resultado: items }
    }

    obtenerPorId = async(id) => {
        try {
            const item = await ModeloItemContenido.findByPk(id)
            if (!item || item.deletedAt !== null) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: item }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}