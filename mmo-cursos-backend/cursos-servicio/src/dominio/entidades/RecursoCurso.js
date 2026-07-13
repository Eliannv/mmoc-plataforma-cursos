export default class RecursoCurso {
    constructor(id, idCurso, nombre, tipo, urlRecurso) {
        this.id = id
        this.idCurso = idCurso
        this.nombre = nombre
        this.tipo = tipo
        this.urlRecurso = urlRecurso
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdCurso() { return this.idCurso }
    setIdCurso(idCurso) { this.idCurso = idCurso }
    getNombre() { return this.nombre }
    setNombre(nombre) { this.nombre = nombre }
    getTipo() { return this.tipo }
    setTipo(tipo) { this.tipo = tipo }
    getUrlRecurso() { return this.urlRecurso }
    setUrlRecurso(urlRecurso) { this.urlRecurso = urlRecurso }
}