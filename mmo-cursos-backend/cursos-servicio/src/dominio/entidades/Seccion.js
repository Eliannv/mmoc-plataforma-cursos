export default class Seccion {
    constructor(id, idCurso, titulo, orden) {
        this.id = id
        this.idCurso = idCurso
        this.titulo = titulo
        this.orden = orden
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdCurso() { return this.idCurso }
    setIdCurso(idCurso) { this.idCurso = idCurso }
    getTitulo() { return this.titulo }
    setTitulo(titulo) { this.titulo = titulo }
    getOrden() { return this.orden }
    setOrden(orden) { this.orden = orden }
}