export class ProgresoDTO {
    constructor(datos) {
        this.idInscripcion = datos.id_inscripcion || null
        this.idItemContenido = datos.id_item_contenido || null
        this.segundosVistos = datos.segundos_vistos !== undefined ? datos.segundos_vistos : null
    }
    getIdInscripcion() { return this.idInscripcion }
    getIdItemContenido() { return this.idItemContenido }
    getSegundosVistos() { return this.segundosVistos }

    validarMarcado() {
        const errores = []
        if (!this.idInscripcion || isNaN(parseInt(this.idInscripcion))) errores.push('El id_inscripcion es obligatorio')
        if (!this.idItemContenido || isNaN(parseInt(this.idItemContenido))) errores.push('El id_item_contenido es obligatorio')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}