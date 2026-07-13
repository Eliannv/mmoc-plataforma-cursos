export class IntentoQuizDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.idInscripcion = datos.id_inscripcion || null
        this.idQuiz = datos.id_quiz || null
        this.idsPreguntas = datos.ids_preguntas || []
        this.respuestas = datos.respuestas || []
    }
    getId() { return this.id }
    getIdInscripcion() { return this.idInscripcion }
    getIdQuiz() { return this.idQuiz }
    getIdsPreguntas() { return this.idsPreguntas }
    getRespuestas() { return this.respuestas }

    validarInicio() {
        const errores = []
        if (!this.idInscripcion || isNaN(parseInt(this.idInscripcion))) errores.push('El id_inscripcion es obligatorio')
        if (!this.idQuiz || isNaN(parseInt(this.idQuiz))) errores.push('El id_quiz es obligatorio')
        if (!this.idsPreguntas || this.idsPreguntas.length !== 5) errores.push('Se requieren exactamente 5 preguntas seleccionadas')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }

    validarRespuestas() {
        const errores = []
        if (!this.respuestas || this.respuestas.length === 0) errores.push('Se requiere al menos una respuesta')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}