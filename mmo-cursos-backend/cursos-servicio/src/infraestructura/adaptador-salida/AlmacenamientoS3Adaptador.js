import AlmacenamientoSalidaPuerto from '../../aplicacion/puertos/salida/AlmacenamientoSalidaPuerto.js'

/**
 * Stub para la futura migración a AWS S3 real.
 *
 * Implementa el puerto pero cada método lanza error "no implementado".
 * Cuando se decida migrar a S3, se completa esta clase — el resto del código
 * (casos de uso, controladores, contenedor) no cambia, solo la variable
 * STORAGE_PROVIDER=s3 en el entorno.
 *
 * Nota de diseño: aunque MinIO y S3 comparten el protocolo S3, se mantienen
 * clases separadas por claridad explícita sobre qué adaptador está activo.
 * No se comparte código entre adaptadores para evitar abstracciones prematuras.
 *
 * TODO (futura entrega): implementar con @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner
 */
export default class AlmacenamientoS3Adaptador extends AlmacenamientoSalidaPuerto {

    generarUrlSubida = async(key, contentType, expiresInSeconds) => {
        throw new Error('[AlmacenamientoS3Adaptador] generarUrlSubida: no implementado. Completa este adaptador para usar AWS S3 real.')
    }

    generarUrlDescarga = async(key, expiresInSeconds) => {
        throw new Error('[AlmacenamientoS3Adaptador] generarUrlDescarga: no implementado.')
    }

    generarUrlDescargaInterna = async(key, expiresInSeconds) => {
        throw new Error('[AlmacenamientoS3Adaptador] generarUrlDescargaInterna: no implementado.')
    }

    eliminarArchivo = async(key) => {
        throw new Error('[AlmacenamientoS3Adaptador] eliminarArchivo: no implementado.')
    }
}