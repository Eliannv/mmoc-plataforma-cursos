export default class OpcionPregunta {
    constructor(id, idPregunta, texto, esCorrecta) {
        this.id = id
        this.idPregunta = idPregunta
        this.texto = texto
        this.esCorrecta = esCorrecta
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdPregunta() { return this.idPregunta }
    setIdPregunta(idPregunta) { this.idPregunta = idPregunta }
    getTexto() { return this.texto }
    setTexto(texto) { this.texto = texto }
    getEsCorrecta() { return this.esCorrecta }
    setEsCorrecta(esCorrecta) { this.esCorrecta = esCorrecta }
}