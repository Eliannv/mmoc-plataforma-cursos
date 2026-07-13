import InscripcionSalidaQueryPuerto from '../../aplicacion/puertos/salida/InscripcionSalidaQueryPuerto.js'
import ModeloInscripcion from '../modelos/ModeloInscripcion.js'

export default class InscripcionPgsQueryAdaptador extends InscripcionSalidaQueryPuerto {

    listarPorUsuario = async(idUsuario) => {
        const inscripciones = await ModeloInscripcion.findAll({ where: { id_usuario: idUsuario, deletedAt: null } })
        return { estado: 'ok', resultado: inscripciones }
    }

    obtenerPorUsuarioYCurso = async(idUsuario, idCurso) => {
        try {
            const inscripcion = await ModeloInscripcion.findOne({ where: { id_usuario: idUsuario, id_curso: idCurso, deletedAt: null } })
            if (!inscripcion) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: inscripcion }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }

    obtenerPorId = async(id) => {
        try {
            const inscripcion = await ModeloInscripcion.findByPk(id)
            if (!inscripcion || inscripcion.deletedAt !== null) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: inscripcion }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}