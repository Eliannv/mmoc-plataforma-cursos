export class UsuarioDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.nombre = datos.nombre || ''
        this.correo = datos.correo || ''
        this.contrasena = datos.contrasena || ''
        this.rol = datos.rol || 'ESTUDIANTE'
        this.estado = datos.estado || 'ACTIVO'
    }

    getId() { return this.id }
    getNombre() { return this.nombre }
    getCorreo() { return this.correo }
    getContrasena() { return this.contrasena }
    getRol() { return this.rol }
    getEstado() { return this.estado }

    setId(id) {
        if (id && typeof id !== 'number' && isNaN(parseInt(id))) {
            throw new Error('El ID debe ser un número válido')
        }
        this.id = id
    }

    setNombre(nombre) {
        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre no puede estar vacío')
        }
        this.nombre = nombre.trim()
    }

    setCorreo(correo) {
        if (!correo || !correo.includes('@')) {
            throw new Error('El correo debe ser válido y contener @')
        }
        this.correo = correo.trim().toLowerCase()
    }

    setContrasena(contrasena) {
        if (!contrasena || contrasena.length < 8) {
            throw new Error('La contraseña debe tener mínimo 8 caracteres')
        }
        this.contrasena = contrasena
    }

    setRol(rol) {
        const rolesValidos = ['ADMIN', 'INSTRUCTOR', 'ESTUDIANTE']
        if (!rol || !rolesValidos.includes(rol.toUpperCase())) {
            throw new Error('El rol debe ser ADMIN, INSTRUCTOR o ESTUDIANTE')
        }
        this.rol = rol.toUpperCase()
    }

    setEstado(estado) {
        const estadosValidos = ['ACTIVO', 'INACTIVO']
        if (!estado || !estadosValidos.includes(estado.toUpperCase())) {
            throw new Error('El estado debe ser ACTIVO o INACTIVO')
        }
        this.estado = estado.toUpperCase()
    }

    validarRegistro() {
        const errores = []
        if (!this.nombre || this.nombre.trim() === '') {
            errores.push('El nombre es obligatorio')
        }
        if (!this.correo || !this.correo.includes('@')) {
            errores.push('El correo es obligatorio y debe ser válido')
        }
        if (!this.contrasena || this.contrasena.length < 8) {
            errores.push('La contraseña es obligatoria y debe tener mínimo 8 caracteres')
        }
        const rolesValidos = ['ADMIN', 'INSTRUCTOR', 'ESTUDIANTE']
        if (!rolesValidos.includes(this.rol)) {
            errores.push('El rol debe ser ADMIN, INSTRUCTOR o ESTUDIANTE')
        }
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }

    validarLogin() {
        const errores = []
        if (!this.correo || !this.correo.includes('@')) {
            errores.push('El correo es obligatorio y debe ser válido')
        }
        if (!this.contrasena || this.contrasena.trim() === '') {
            errores.push('La contraseña es obligatoria')
        }
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}