export default class Quiz {
    constructor(id, idItem, instrucciones) {
        this.id = id
        this.idItem = idItem
        this.instrucciones = instrucciones
    }
    getId() { return this.id }
    setId(id) { this.id = id }
    getIdItem() { return this.idItem }
    setIdItem(idItem) { this.idItem = idItem }
    getInstrucciones() { return this.instrucciones }
    setInstrucciones(instrucciones) { this.instrucciones = instrucciones }
}