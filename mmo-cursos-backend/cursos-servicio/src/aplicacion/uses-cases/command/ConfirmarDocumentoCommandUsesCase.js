// Confirma que el instructor ya subió el documento a MinIO.
// Registra el storage_key y nombre_archivo en la base de datos.
export default class ConfirmarDocumentoCommandUsesCase {
    constructor(documentoCommandAdaptador, documentoQueryAdaptador) {
        this.documentoCommandAdaptador = documentoCommandAdaptador
        this.documentoQueryAdaptador = documentoQueryAdaptador
    }

    async confirmar(idItem, nombreArchivo) {
        const respuesta = await this.documentoQueryAdaptador.obtenerPorItem(idItem)
        if (respuesta.estado === 'error' || !respuesta.resultado) {
            return { estado: 'error', resultado: 'Documento no encontrado para este ítem' }
        }

        const ext = nombreArchivo.split('.').pop() || 'pdf'
        const storageKey = `docs/${idItem}/archivo.${ext}`

        const resultado = await this.documentoCommandAdaptador.guardarStorageKey(idItem, storageKey, nombreArchivo)
        console.log(`✓ Documento confirmado para ítem ${idItem}: ${storageKey}`)
        return resultado
    }
}