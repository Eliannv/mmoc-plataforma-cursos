import { Client } from 'minio'
import AlmacenamientoSalidaPuerto from '../../aplicacion/puertos/salida/AlmacenamientoSalidaPuerto.js'

/**
 * Adaptador MinIO con presigned URLs.
 *
 * Problema de hostname en Docker:
 *   - Para que la firma sea válida, la URL prefirmada debe usar el MISMO hostname
 *     con el que se firmó. Si firmamos con "minio" pero el navegador accede con "localhost",
 *     MinIO rechaza con SignatureDoesNotMatch.
 *   - Si usamos "localhost" en el cliente público, el SDK intenta una llamada de red
 *     a localhost:9000 para descubrir la región del bucket → ECONNREFUSED dentro del contenedor.
 *
 * Solución: configurar `region` explícitamente en el constructor.
 *   Con region pre-configurada, el SDK salta la llamada de red a getBucketRegion() y
 *   firma offline. Así el clientePublico puede usar "localhost" sin necesitar conectividad.
 *
 * Variables de entorno:
 *   MINIO_ENDPOINT          hostname interno Docker (default "minio")
 *   MINIO_PUBLIC_ENDPOINT   hostname accesible desde el navegador (default "localhost")
 *   MINIO_PORT              puerto (default 9000)
 *   MINIO_PUBLIC_PORT       puerto público (default = MINIO_PORT)
 *   MINIO_REGION            región S3 (default "us-east-1")
 *   MINIO_ACCESS_KEY / MINIO_SECRET_KEY / MINIO_BUCKET / MINIO_USE_SSL
 */
export default class AlmacenamientoMinioAdaptador extends AlmacenamientoSalidaPuerto {
    constructor() {
        super()
        const useSSL = process.env.MINIO_USE_SSL === 'true'
            // Pre-configurar la región evita que el SDK haga una llamada de red a getBucketRegion()
        const region = process.env.MINIO_REGION || 'us-east-1'
        const credenciales = {
            useSSL,
            region,
            accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
            secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
        }

        // Cliente interno: operaciones servidor-a-servidor dentro de Docker (eliminar, ffprobe)
        this.clienteInterno = new Client({
            endPoint: process.env.MINIO_ENDPOINT || 'minio',
            port: parseInt(process.env.MINIO_PORT) || 9000,
            ...credenciales
        })

        // Cliente público: genera presigned URLs firmadas con el hostname del navegador.
        // No hace llamadas de red gracias a la región pre-configurada.
        this.clientePublico = new Client({
            endPoint: process.env.MINIO_PUBLIC_ENDPOINT || 'localhost',
            port: parseInt(process.env.MINIO_PUBLIC_PORT) || parseInt(process.env.MINIO_PORT) || 9000,
            ...credenciales
        })

        this.bucket = process.env.MINIO_BUCKET || 'mmo-cursos'
    }

    /**
     * Genera URL prefirmada PUT para subida directa del navegador a MinIO.
     */
    generarUrlSubida = async(key, contentType, expiresInSeconds = 3600) => {
        try {
            const url = await this.clientePublico.presignedPutObject(this.bucket, key, expiresInSeconds)
            console.log(`✓ URL subida generada para key: ${key}`)
            return { estado: 'ok', urlSubida: url, key }
        } catch (error) {
            console.error(`✗ Error generando URL de subida: ${error.message}`)
            return { estado: 'error', resultado: `Error generando URL de subida: ${error.message}` }
        }
    }

    /**
     * Genera URL prefirmada GET para reproducción/descarga desde el navegador.
     */
    generarUrlDescarga = async(key, expiresInSeconds = 3600) => {
        try {
            const url = await this.clientePublico.presignedGetObject(this.bucket, key, expiresInSeconds)
            return { estado: 'ok', urlDescarga: url }
        } catch (error) {
            console.error(`✗ Error generando URL de descarga: ${error.message}`)
            return { estado: 'error', resultado: `Error generando URL de descarga: ${error.message}` }
        }
    }

    /**
     * Genera URL prefirmada GET con hostname interno (para ffprobe dentro del contenedor).
     */
    generarUrlDescargaInterna = async(key, expiresInSeconds = 600) => {
        try {
            const url = await this.clienteInterno.presignedGetObject(this.bucket, key, expiresInSeconds)
            return { estado: 'ok', urlDescarga: url }
        } catch (error) {
            console.error(`✗ Error generando URL interna: ${error.message}`)
            return { estado: 'error', resultado: `Error generando URL interna: ${error.message}` }
        }
    }

    /**
     * Elimina el objeto del bucket.
     */
    eliminarArchivo = async(key) => {
        try {
            await this.clienteInterno.removeObject(this.bucket, key)
            console.log(`✓ Archivo eliminado de MinIO: ${key}`)
            return { estado: 'ok' }
        } catch (error) {
            console.error(`✗ Error eliminando archivo de MinIO: ${error.message}`)
            return { estado: 'error', resultado: `Error eliminando archivo: ${error.message}` }
        }
    }
}