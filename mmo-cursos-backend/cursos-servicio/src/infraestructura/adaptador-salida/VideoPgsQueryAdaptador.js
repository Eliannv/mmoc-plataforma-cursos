import VideoSalidaQueryPuerto from '../../aplicacion/puertos/salida/VideoSalidaQueryPuerto.js'
import ModeloVideo from '../modelos/ModeloVideo.js'

export default class VideoPgsQueryAdaptador extends VideoSalidaQueryPuerto {

    obtenerPorItem = async(idItem) => {
        try {
            const video = await ModeloVideo.findOne({ where: { id_item: idItem, deletedAt: null } })
            if (!video) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: video }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}