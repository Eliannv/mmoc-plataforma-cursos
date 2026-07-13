export default class RespuestaIntento {
    constructor(id, idIntento, idPregunta, idOpcionSeleccionada, esCorrecta) {
        this.id = id
        this.idIntento = idIntento
        this.idPregunta = idPregunta
        this.idOpcionSeleccionada = idOpcionSeleccionada
        this.esCorrecta = esCorrecta
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdIntento() { return this.idIntento }
    getIdPregunta() { return this.idPregunta }
    getIdOpcionSeleccionada() { return this.idOpcionSeleccionada }
    getEsCorrecta() { return this.esCorrecta }
    setEsCorrecta(esCorrecta) { this.esCorrecta = esCorrecta }
}