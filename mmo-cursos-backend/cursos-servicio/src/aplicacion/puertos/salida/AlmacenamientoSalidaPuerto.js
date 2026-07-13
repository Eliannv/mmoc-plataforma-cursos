// Puerto de almacenamiento — patrón presigned URL: el binario nunca pasa por el backend
export default class AlmacenamientoSalidaPuerto {
    // Genera URL prefirmada PUT para que el cliente suba el archivo directo a MinIO/S3
    generarUrlSubida(key, contentType, expiresInSeconds) { throw new Error('Método generarUrlSubida no implementado') }

    // Genera URL prefirmada GET accesible desde el navegador (expiración razonable)
    generarUrlDescarga(key, expiresInSeconds) { throw new Error('Método generarUrlDescarga no implementado') }

    // Genera URL prefirmada GET accesible desde el servidor (para ffprobe, etc.)
    generarUrlDescargaInterna(key, expiresInSeconds) { throw new Error('Método generarUrlDescargaInterna no implementado') }

    // Elimina el objeto del almacenamiento
    eliminarArchivo(key) { throw new Error('Método eliminarArchivo no implementado') }
}