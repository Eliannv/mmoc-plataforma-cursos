export default class Curso {
    constructor(id, titulo, descripcion, nivel, estado, idCategoria, idInstructor, duracionTotalMinutos) {
        this.id = id
        this.titulo = titulo
        this.descripcion = descripcion
        this.nivel = nivel
        this.estado = estado
        this.idCategoria = idCategoria
        this.idInstructor = idInstructor
        this.duracionTotalMinutos = duracionTotalMinutos || 0
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getTitulo() { return this.titulo }
    setTitulo(titulo) { this.titulo = titulo }
    getDescripcion() { return this.descripcion }
    setDescripcion(descripcion) { this.descripcion = descripcion }
    getNivel() { return this.nivel }
    setNivel(nivel) { this.nivel = nivel }
    getEstado() { return this.estado }
    setEstado(estado) { this.estado = estado }
    getIdCategoria() { return this.idCategoria }
    setIdCategoria(idCategoria) { this.idCategoria = idCategoria }
    getIdInstructor() { return this.idInstructor }
    setIdInstructor(idInstructor) { this.idInstructor = idInstructor }
    getDuracionTotalMinutos() { return this.duracionTotalMinutos }
    setDuracionTotalMinutos(duracion) { this.duracionTotalMinutos = duracion }
}