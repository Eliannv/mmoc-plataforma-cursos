export class VideoDTO {
    constructor(datos) {
        this.idItem = datos.id_item || null
        this.storageKey = datos.storage_key || null
        this.duracionSegundos = datos.duracion_segundos || null
        this.estadoProcesamiento = datos.estado_procesamiento || 'PENDIENTE'
    }
    getIdItem() { return this.idItem }
    getStorageKey() { return this.storageKey }
    getDuracionSegundos() { return this.duracionSegundos }
    getEstadoProcesamiento() { return this.estadoProcesamiento }
}