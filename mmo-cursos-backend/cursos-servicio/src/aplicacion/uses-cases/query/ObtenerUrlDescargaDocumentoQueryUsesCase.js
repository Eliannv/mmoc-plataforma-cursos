export default class ObtenerUrlDescargaDocumentoQueryUsesCase {
    constructor(documentoQueryAdaptador, almacenamiento) {
        this.documentoQueryAdaptador = documentoQueryAdaptador
        this.almacenamiento = almacenamiento
    }

    async obtenerUrlDescarga(idItem) {
        const respuesta = await this.documentoQueryAdaptador.obtenerPorItem(idItem)
        if (respuesta.estado === 'error' || !respuesta.resultado) {
            return { estado: 'error', resultado: 'Documento no encontrado' }
        }

        const documento = respuesta.resultado
        if (!documento.storage_key) {
            return { estado: 'error', resultado: 'El documento aún no ha sido subido' }
        }

        const urlResp = await this.almacenamiento.generarUrlDescarga(documento.storage_key)
        if (urlResp.estado === 'error') return urlResp

        return { estado: 'ok', urlDescarga: urlResp.urlDescarga, nombre_archivo: documento.nombre_archivo }
    }
}