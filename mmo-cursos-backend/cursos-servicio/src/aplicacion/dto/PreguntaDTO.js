export class PreguntaDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.idQuiz = datos.id_quiz || null
        this.enunciado = datos.enunciado || ''
        this.orden = datos.orden || 1
        this.opciones = datos.opciones || []
    }
    getId() { return this.id }
    getIdQuiz() { return this.idQuiz }
    getEnunciado() { return this.enunciado }
    getOrden() { return this.orden }
    getOpciones() { return this.opciones }

    validarCreacion() {
        const errores = []
        if (!this.idQuiz || isNaN(parseInt(this.idQuiz))) errores.push('El id_quiz es obligatorio')
        if (!this.enunciado || this.enunciado.trim() === '') errores.push('El enunciado de la pregunta es obligatorio')
        if (!this.opciones || this.opciones.length < 2) errores.push('La pregunta debe tener al menos 2 opciones')
        const tieneCorrecta = this.opciones.some(o => o.es_correcta === true)
        if (!tieneCorrecta) errores.push('La pregunta debe tener al menos una opción correcta')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}