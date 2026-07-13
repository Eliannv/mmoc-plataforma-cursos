import Seccion from '../../../dominio/entidades/Seccion.js'

export default class SeccionCommandUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async crear(dtoSeccion) {
        const seccion = new Seccion(null, dtoSeccion.getIdCurso(), dtoSeccion.getTitulo(), dtoSeccion.getOrden())
        const resultado = await this.adaptadorBDSalida.guardar(seccion)
        console.log('Sección creada en caso de uso')
        return resultado
    }

    async editar(dtoSeccion, datosProvistos = {}) {
        if (!dtoSeccion.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para actualizar' }
        }
        const seccion = new Seccion(dtoSeccion.getId(), dtoSeccion.getIdCurso(), dtoSeccion.getTitulo(), dtoSeccion.getOrden())
        return await this.adaptadorBDSalida.editar(seccion, datosProvistos)
    }

    async eliminar(dtoSeccion) {
        if (!dtoSeccion.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para eliminar' }
        }
        return await this.adaptadorBDSalida.eliminar(dtoSeccion)
    }
}