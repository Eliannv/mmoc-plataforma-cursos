import Categoria from '../../../dominio/entidades/Categoria.js'

export default class CategoriaCommandUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async crear(dtoCategoria) {
        const categoria = new Categoria(null, dtoCategoria.getNombre(), dtoCategoria.getDescripcion(), dtoCategoria.getEstado())
        const resultado = await this.adaptadorBDSalida.guardar(categoria)
        console.log('Categoría creada en caso de uso')
        return resultado
    }

    async editar(dtoCategoria, datosProvistos = {}) {
        if (!dtoCategoria.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para actualizar' }
        }
        const categoria = new Categoria(dtoCategoria.getId(), dtoCategoria.getNombre(), dtoCategoria.getDescripcion(), dtoCategoria.getEstado())
        const resultado = await this.adaptadorBDSalida.editar(categoria, datosProvistos)
        console.log('Categoría actualizada en caso de uso')
        return resultado
    }

    async eliminar(dtoCategoria) {
        if (!dtoCategoria.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para eliminar' }
        }
        const resultado = await this.adaptadorBDSalida.eliminar(dtoCategoria)
        console.log('Categoría eliminada en caso de uso')
        return resultado
    }
}