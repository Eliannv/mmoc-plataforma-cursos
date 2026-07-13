import CategoriaSalidaQueryPuerto from '../../aplicacion/puertos/salida/CategoriaSalidaQueryPuerto.js'
import ModeloCategoria from '../modelos/ModeloCategoria.js'

export default class CategoriaPgsQueryAdaptador extends CategoriaSalidaQueryPuerto {

    lista = async(filtros = []) => {
        const where = { deletedAt: null }
        const categorias = await ModeloCategoria.findAll({ where })
        return { estado: 'ok', resultado: categorias }
    }

    obtenerPorId = async(id) => {
        try {
            const categoria = await ModeloCategoria.findByPk(id)
            if (!categoria || categoria.deletedAt !== null) return { estado: 'error', resultado: null }
            return { estado: 'ok', resultado: categoria }
        } catch (error) {
            return { estado: 'error', resultado: null }
        }
    }
}