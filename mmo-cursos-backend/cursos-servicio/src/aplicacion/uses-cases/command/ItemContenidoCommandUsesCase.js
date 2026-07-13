import ItemContenido from '../../../dominio/entidades/ItemContenido.js'

export default class ItemContenidoCommandUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async crear(dtoItem) {
        const item = new ItemContenido(null, dtoItem.getIdSeccion(), dtoItem.getTitulo(), dtoItem.getTipo(), dtoItem.getOrden())
        const datosSubRecurso = {
            url_video: dtoItem.getUrlVideo(),
            duracion_segundos: dtoItem.getDuracionSegundos(),
            url_documento: dtoItem.getUrlDocumento(),
            nombre_archivo: dtoItem.getNombreArchivo(),
            instrucciones: dtoItem.getInstrucciones(),
            url_actividad: dtoItem.getUrlActividad()
        }
        const resultado = await this.adaptadorBDSalida.guardar(item, datosSubRecurso)
        console.log('Ítem de contenido creado en caso de uso')
        return resultado
    }

    async editar(dtoItem, datosProvistos = {}) {
        if (!dtoItem.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para actualizar' }
        }
        const item = new ItemContenido(dtoItem.getId(), dtoItem.getIdSeccion(), dtoItem.getTitulo(), dtoItem.getTipo(), dtoItem.getOrden())
        return await this.adaptadorBDSalida.editar(item, datosProvistos)
    }

    async eliminar(dtoItem) {
        if (!dtoItem.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para eliminar' }
        }
        return await this.adaptadorBDSalida.eliminar(dtoItem)
    }
}