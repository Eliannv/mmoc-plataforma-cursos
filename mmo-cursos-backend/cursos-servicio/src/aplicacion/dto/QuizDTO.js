export class QuizDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.idItem = datos.id_item || null
        this.instrucciones = datos.instrucciones || ''
    }
    getId() { return this.id }
    getIdItem() { return this.idItem }
    getInstrucciones() { return this.instrucciones }

    validarCreacion() {
        const errores = []
        if (!this.idItem || isNaN(parseInt(this.idItem))) errores.push('El id_item es obligatorio')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}