export default class Inscripcion {
    constructor(id, idUsuario, idCurso, fechaInscripcion, estado) {
        this.id = id
        this.idUsuario = idUsuario
        this.idCurso = idCurso
        this.fechaInscripcion = fechaInscripcion
        this.estado = estado
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdUsuario() { return this.idUsuario }
    setIdUsuario(idUsuario) { this.idUsuario = idUsuario }
    getIdCurso() { return this.idCurso }
    setIdCurso(idCurso) { this.idCurso = idCurso }
    getFechaInscripcion() { return this.fechaInscripcion }
    getEstado() { return this.estado }
    setEstado(estado) { this.estado = estado }
}