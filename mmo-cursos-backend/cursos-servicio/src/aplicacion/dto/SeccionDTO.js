export class SeccionDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.idCurso = datos.id_curso || null
        this.titulo = datos.titulo || ''
        this.orden = datos.orden || 1
    }
    getId() { return this.id }
    getIdCurso() { return this.idCurso }
    getTitulo() { return this.titulo }
    getOrden() { return this.orden }

    validarCreacion() {
        const errores = []
        if (!this.titulo || this.titulo.trim() === '') errores.push('El título de la sección es obligatorio')
        if (!this.idCurso || isNaN(parseInt(this.idCurso))) errores.push('El id_curso es obligatorio')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}