export default class ItemContenido {
    constructor(id, idSeccion, titulo, tipo, orden) {
        this.id = id
        this.idSeccion = idSeccion
        this.titulo = titulo
        this.tipo = tipo
        this.orden = orden
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdSeccion() { return this.idSeccion }
    setIdSeccion(idSeccion) { this.idSeccion = idSeccion }
    getTitulo() { return this.titulo }
    setTitulo(titulo) { this.titulo = titulo }
    getTipo() { return this.tipo }
    setTipo(tipo) { this.tipo = tipo }
    getOrden() { return this.orden }
    setOrden(orden) { this.orden = orden }
}