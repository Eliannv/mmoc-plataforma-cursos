export class CategoriaDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.nombre = datos.nombre || ''
        this.descripcion = datos.descripcion || ''
        this.estado = datos.estado || 'ACTIVO'
    }
    getId() { return this.id }
    getNombre() { return this.nombre }
    getDescripcion() { return this.descripcion }
    getEstado() { return this.estado }

    validarCreacion() {
        const errores = []
        if (!this.nombre || this.nombre.trim() === '') errores.push('El nombre de la categoría es obligatorio')
        if (!['ACTIVO', 'INACTIVO'].includes(this.estado)) errores.push('El estado debe ser ACTIVO o INACTIVO')
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }

    validarActualizacion(datosProvistos = {}) {
        const errores = []
        if (datosProvistos.hasOwnProperty('nombre') && (!this.nombre || this.nombre.trim() === '')) {
            errores.push('El nombre no puede estar vacío')
        }
        if (datosProvistos.hasOwnProperty('estado') && !['ACTIVO', 'INACTIVO'].includes(this.estado)) {
            errores.push('El estado debe ser ACTIVO o INACTIVO')
        }
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}