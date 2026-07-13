export default class Pregunta {
    constructor(id, idQuiz, enunciado, orden) {
        this.id = id
        this.idQuiz = idQuiz
        this.enunciado = enunciado
        this.orden = orden
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdQuiz() { return this.idQuiz }
    setIdQuiz(idQuiz) { this.idQuiz = idQuiz }
    getEnunciado() { return this.enunciado }
    setEnunciado(enunciado) { this.enunciado = enunciado }
    getOrden() { return this.orden }
    setOrden(orden) { this.orden = orden }
}