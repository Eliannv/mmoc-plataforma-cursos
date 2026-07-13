export default class ProgresoCommandUsesCase {
    constructor(adaptadorCommandSalida) {
        this.adaptadorCommandSalida = adaptadorCommandSalida
    }

    async marcarAvance(dtoProgreso) {
        const resultado = await this.adaptadorCommandSalida.marcarOCrear(
            dtoProgreso.getIdInscripcion(),
            dtoProgreso.getIdItemContenido(),
            dtoProgreso.getSegundosVistos()
        )
        console.log('Avance de contenido registrado en caso de uso')
        return resultado
    }
}