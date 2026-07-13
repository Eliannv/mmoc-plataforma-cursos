export class CursoDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.titulo = datos.titulo || ''
        this.descripcion = datos.descripcion || ''
        this.nivel = datos.nivel || 'BASICO'
        this.estado = datos.estado || 'BORRADOR'
        this.idCategoria = datos.id_categoria || null
        this.idInstructor = datos.id_instructor || null
        this.duracionTotalMinutos = datos.duracion_total_minutos || 0
    }
    getId() { return this.id }
    getTitulo() { return this.titulo }
    getDescripcion() { return this.descripcion }
    getNivel() { return this.nivel }
    getEstado() { return this.estado }
    getIdCategoria() { return this.idCategoria }
    getIdInstructor() { return this.idInstructor }
    getDuracionTotalMinutos() { return this.duracionTotalMinutos }

    validarCreacion() {
        const errores = []
        if (!this.titulo || this.titulo.trim() === '') errores.push('El título del curso es obligatorio')
        if (!['BASICO', 'INTERMEDIO'].includes(this.nivel)) errores.push('El nivel debe ser BASICO o INTERMEDIO')
        if (!this.idCategoria || isNaN(parseInt(this.idCategoria))) errores.push('El id_categoria es obligatorio y debe ser un número')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }

    validarActualizacion(datosProvistos = {}) {
        const errores = []
        if (datosProvistos.hasOwnProperty('titulo') && (!this.titulo || this.titulo.trim() === '')) {
            errores.push('El título no puede estar vacío')
        }
        if (datosProvistos.hasOwnProperty('nivel') && !['BASICO', 'INTERMEDIO'].includes(this.nivel)) {
            errores.push('El nivel debe ser BASICO o INTERMEDIO')
        }
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}