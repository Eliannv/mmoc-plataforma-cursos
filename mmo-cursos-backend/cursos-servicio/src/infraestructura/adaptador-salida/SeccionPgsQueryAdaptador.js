import SeccionSalidaQueryPuerto from '../../aplicacion/puertos/salida/SeccionSalidaQueryPuerto.js'
import ModeloSeccion from '../modelos/ModeloSeccion.js'
import ModeloItemContenido from '../modelos/ModeloItemContenido.js'

export default class SeccionPgsQueryAdaptador extends SeccionSalidaQueryPuerto {

    listarPorCurso = async(idCurso) => {
        const secciones = await ModeloSeccion.findAll({
            where: { id_curso: idCurso, deletedAt: null },
            order: [
                ['orden', 'ASC']
            ]
        })
        return { estado: 'ok', resultado: secciones }
    }

    obtenerPorId = async(id) => {
        try {
            const seccion = await ModeloSeccion.findByPk(id)
            if (!seccion || seccion.deletedAt !== null) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: seccion }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}