import DocumentoSalidaQueryPuerto from '../../aplicacion/puertos/salida/DocumentoSalidaQueryPuerto.js'
import ModeloDocumento from '../modelos/ModeloDocumento.js'

export default class DocumentoPgsQueryAdaptador extends DocumentoSalidaQueryPuerto {

    obtenerPorItem = async(idItem) => {
        try {
            const doc = await ModeloDocumento.findOne({ where: { id_item: idItem, deletedAt: null } })
            if (!doc) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: doc }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}