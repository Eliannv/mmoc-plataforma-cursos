export class InscripcionDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.idUsuario = datos.id_usuario || null
        this.idCurso = datos.id_curso || null
        this.estado = datos.estado || 'ACTIVO'
    }
    getId() { return this.id }
    getIdUsuario() { return this.idUsuario }
    getIdCurso() { return this.idCurso }
    getEstado() { return this.estado }

    validarCreacion() {
        const errores = []
        if (!this.idCurso || isNaN(parseInt(this.idCurso))) errores.push('El id_curso es obligatorio')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}