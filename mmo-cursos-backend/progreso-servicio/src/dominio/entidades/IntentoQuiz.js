export default class IntentoQuiz {
    constructor(id, idInscripcion, idQuiz, preguntasSeleccionadas, puntaje, completado, fechaInicio, fechaFin) {
        this.id = id
        this.idInscripcion = idInscripcion
        this.idQuiz = idQuiz
        this.preguntasSeleccionadas = preguntasSeleccionadas
        this.puntaje = puntaje
        this.completado = completado
        this.fechaInicio = fechaInicio
        this.fechaFin = fechaFin
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdInscripcion() { return this.idInscripcion }
    getIdQuiz() { return this.idQuiz }
    getPreguntasSeleccionadas() { return this.preguntasSeleccionadas }
    getPuntaje() { return this.puntaje }
    setPuntaje(puntaje) { this.puntaje = puntaje }
    getCompletado() { return this.completado }
    setCompletado(completado) { this.completado = completado }
    getFechaInicio() { return this.fechaInicio }
    getFechaFin() { return this.fechaFin }
    setFechaFin(fechaFin) { this.fechaFin = fechaFin }
}