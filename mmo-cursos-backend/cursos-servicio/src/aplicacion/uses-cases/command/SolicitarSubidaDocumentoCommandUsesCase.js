// Solicita URL prefirmada PUT para que el instructor suba el documento directamente a MinIO
export default class SolicitarSubidaDocumentoCommandUsesCase {
    constructor(documentoQueryAdaptador, almacenamiento) {
        this.documentoQueryAdaptador = documentoQueryAdaptador
        this.almacenamiento = almacenamiento
    }

    async solicitarSubida(idItem, contentType = 'application/pdf', nombreArchivo = '') {
        const respuesta = await this.documentoQueryAdaptador.obtenerPorItem(idItem)
        if (respuesta.estado === 'error' || !respuesta.resultado) {
            return { estado: 'error', resultado: 'Ítem de documento no encontrado' }
        }

        const ext = nombreArchivo.split('.').pop() || 'pdf'
        const key = `docs/${idItem}/archivo.${ext}`

        const resultado = await this.almacenamiento.generarUrlSubida(key, contentType)
        if (resultado.estado === 'error') {
            return resultado
        }

        return { estado: 'ok', urlSubida: resultado.urlSubida, key, expiresInSeconds: 3600 }
    }
}