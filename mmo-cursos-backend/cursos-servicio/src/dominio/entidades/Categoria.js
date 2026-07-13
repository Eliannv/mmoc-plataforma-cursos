export default class Categoria {
    constructor(id, nombre, descripcion, estado) {
        this.id = id
        this.nombre = nombre
        this.descripcion = descripcion
        this.estado = estado
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getNombre() { return this.nombre }
    setNombre(nombre) { this.nombre = nombre }
    getDescripcion() { return this.descripcion }
    setDescripcion(descripcion) { this.descripcion = descripcion }
    getEstado() { return this.estado }
    setEstado(estado) { this.estado = estado }
}