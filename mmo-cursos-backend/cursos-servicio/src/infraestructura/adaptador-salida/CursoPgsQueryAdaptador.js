import CursoSalidaQueryPuerto from '../../aplicacion/puertos/salida/CursoSalidaQueryPuerto.js'
import ModeloCurso from '../modelos/ModeloCurso.js'
import ModeloSeccion from '../modelos/ModeloSeccion.js'
import ModeloItemContenido from '../modelos/ModeloItemContenido.js'
import CursoFiltro from '../../dominio/filtros/CursoFiltro.js'

export default class CursoPgsQueryAdaptador extends CursoSalidaQueryPuerto {

    lista = async(filtros = []) => {
        const where = { deletedAt: null }
        filtros.forEach(f => {
            if (f instanceof CursoFiltro) {
                if (f.idCategoria) where.id_categoria = f.idCategoria
                if (f.estado) where.estado = f.estado
                if (f.idInstructor) where.id_instructor = f.idInstructor
            }
        })
        const cursos = await ModeloCurso.findAll({ where })
        return { estado: 'ok', resultado: cursos }
    }

    obtenerPorId = async(id) => {
        try {
            const curso = await ModeloCurso.findByPk(id)
            if (!curso || curso.deletedAt !== null) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: curso }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }

    obtenerConSeccionesPublico = async(id) => {
        try {
            const curso = await ModeloCurso.findOne({
                where: { id, deletedAt: null, estado: 'PUBLICADO' },
                include: [{
                    model: ModeloSeccion,
                    as: 'secciones',
                    where: { deletedAt: null },
                    required: false,
                    include: [{
                        model: ModeloItemContenido,
                        as: 'items',
                        where: { deletedAt: null },
                        required: false
                    }]
                }]
            })
            if (!curso) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: curso }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }

    obtenerConSecciones = async(id) => {
        try {
            const curso = await ModeloCurso.findOne({
                where: { id, deletedAt: null },
                include: [{
                    model: ModeloSeccion,
                    as: 'secciones',
                    where: { deletedAt: null },
                    required: false,
                    include: [{
                        model: ModeloItemContenido,
                        as: 'items',
                        where: { deletedAt: null },
                        required: false
                    }]
                }]
            })
            if (!curso) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: curso }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}