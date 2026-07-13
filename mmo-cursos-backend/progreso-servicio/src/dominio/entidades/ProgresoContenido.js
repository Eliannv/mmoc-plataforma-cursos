export default class ProgresoContenido {
    constructor(id, idInscripcion, idItemContenido, completado, fechaCompletado) {
        this.id = id
        this.idInscripcion = idInscripcion
        this.idItemContenido = idItemContenido
        this.completado = completado
        this.fechaCompletado = fechaCompletado
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdInscripcion() { return this.idInscripcion }
    getIdItemContenido() { return this.idItemContenido }
    getCompletado() { return this.completado }
    setCompletado(completado) { this.completado = completado }
    getFechaCompletado() { return this.fechaCompletado }
    setFechaCompletado(fecha) { this.fechaCompletado = fecha }
}