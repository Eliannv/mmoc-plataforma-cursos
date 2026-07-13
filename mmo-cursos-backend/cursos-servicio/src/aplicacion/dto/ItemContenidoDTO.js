export class ItemContenidoDTO {
    constructor(datos) {
        this.id = datos.id || null
        this.idSeccion = datos.id_seccion || null
        this.titulo = datos.titulo || ''
        this.tipo = datos.tipo || 'VIDEO'
        this.orden = datos.orden || 1
            // Datos del sub-recurso según tipo
        this.urlVideo = datos.url_video || null
        this.duracionSegundos = datos.duracion_segundos || null
        this.urlDocumento = datos.url_documento || null
        this.nombreArchivo = datos.nombre_archivo || null
        this.instrucciones = datos.instrucciones || null
        this.urlActividad = datos.url_actividad || null
    }
    getId() { return this.id }
    getIdSeccion() { return this.idSeccion }
    getTitulo() { return this.titulo }
    getTipo() { return this.tipo }
    getOrden() { return this.orden }
    getUrlVideo() { return this.urlVideo }
    getDuracionSegundos() { return this.duracionSegundos }
    getUrlDocumento() { return this.urlDocumento }
    getNombreArchivo() { return this.nombreArchivo }
    getInstrucciones() { return this.instrucciones }
    getUrlActividad() { return this.urlActividad }

    validarCreacion() {
        const errores = []
        if (!this.titulo || this.titulo.trim() === '') errores.push('El título del ítem es obligatorio')
        if (!this.idSeccion || isNaN(parseInt(this.idSeccion))) errores.push('El id_seccion es obligatorio')
        const tiposValidos = ['VIDEO', 'DOCUMENTO', 'ACTIVIDAD_INTERACTIVA', 'QUIZ']
        if (!tiposValidos.includes(this.tipo)) errores.push('El tipo debe ser VIDEO, DOCUMENTO, ACTIVIDAD_INTERACTIVA o QUIZ')
        if (this.tipo === 'VIDEO' && this.duracionSegundos) {
            if (this.duracionSegundos < 180 || this.duracionSegundos > 240) {
                errores.push('La duración del video debe estar entre 180 y 240 segundos (3-4 minutos)')
            }
        }
        if (errores.length > 0) throw new Error(JSON.stringify(errores))
        return true
    }
}