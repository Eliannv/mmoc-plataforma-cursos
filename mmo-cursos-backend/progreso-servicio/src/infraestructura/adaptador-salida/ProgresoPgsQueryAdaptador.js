import ProgresoSalidaQueryPuerto from '../../aplicacion/puertos/salida/ProgresoSalidaQueryPuerto.js'
import ModeloProgresoContenido from '../modelos/ModeloProgresoContenido.js'

export default class ProgresoPgsQueryAdaptador extends ProgresoSalidaQueryPuerto {

    listarPorInscripcion = async(idInscripcion) => {
        const progresos = await ModeloProgresoContenido.findAll({
            where: { id_inscripcion: idInscripcion, deletedAt: null, completado: true }
        })
        return { estado: 'ok', resultado: progresos }
    }
}