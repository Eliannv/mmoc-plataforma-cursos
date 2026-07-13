export default class Usuario {
    constructor(id, nombre, correo, contrasena, rol, estado) {
        this.id = id
        this.nombre = nombre
        this.correo = correo
        this.contrasena = contrasena
        this.rol = rol
        this.estado = estado
    }

    getId() { return this.id }
    setId(id) { this.id = id }

    getNombre() { return this.nombre }
    setNombre(nombre) { this.nombre = nombre }

    getCorreo() { return this.correo }
    setCorreo(correo) { this.correo = correo }

    getContrasena() { return this.contrasena }
    setContrasena(contrasena) { this.contrasena = contrasena }

    getRol() { return this.rol }
    setRol(rol) { this.rol = rol }

    getEstado() { return this.estado }
    setEstado(estado) { this.estado = estado }
}