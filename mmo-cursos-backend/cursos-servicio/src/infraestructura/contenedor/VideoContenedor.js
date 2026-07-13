import { VideoControlador } from '../adaptador-entrada/VideoControlador.js'
import VideoPgsCommandAdaptador from '../adaptador-salida/VideoPgsCommandAdaptador.js'
import VideoPgsQueryAdaptador from '../adaptador-salida/VideoPgsQueryAdaptador.js'
import AlmacenamientoMinioAdaptador from '../adaptador-salida/AlmacenamientoMinioAdaptador.js'
import AlmacenamientoS3Adaptador from '../adaptador-salida/AlmacenamientoS3Adaptador.js'
import AlmacenamientoLocalAdaptador from '../adaptador-salida/AlmacenamientoLocalAdaptador.js'
import SolicitarSubidaVideoCommandUsesCase from '../../aplicacion/uses-cases/command/SolicitarSubidaVideoCommandUsesCase.js'
import ConfirmarVideoCommandUsesCase from '../../aplicacion/uses-cases/command/ConfirmarVideoCommandUsesCase.js'
import ObtenerUrlDescargaVideoQueryUsesCase from '../../aplicacion/uses-cases/query/ObtenerUrlDescargaVideoQueryUsesCase.js'

// Paso 5 — Wiring según STORAGE_PROVIDER
const almacenamiento =
    process.env.STORAGE_PROVIDER === 'minio' ?
    new AlmacenamientoMinioAdaptador() :
    process.env.STORAGE_PROVIDER === 's3' ?
    new AlmacenamientoS3Adaptador() :
    new AlmacenamientoLocalAdaptador()

console.log(`✓ Proveedor de almacenamiento: ${process.env.STORAGE_PROVIDER || 'local'}`)

const videoCommandAdaptador = new VideoPgsCommandAdaptador()
const videoQueryAdaptador = new VideoPgsQueryAdaptador()

const solicitarSubidaCasoUso = new SolicitarSubidaVideoCommandUsesCase(videoCommandAdaptador, videoQueryAdaptador, almacenamiento)
const confirmarCasoUso = new ConfirmarVideoCommandUsesCase(videoCommandAdaptador, videoQueryAdaptador, almacenamiento)
const obtenerUrlDescargaCasoUso = new ObtenerUrlDescargaVideoQueryUsesCase(videoQueryAdaptador, almacenamiento)

const videoControlador = new VideoControlador(solicitarSubidaCasoUso, confirmarCasoUso, obtenerUrlDescargaCasoUso)

export { videoControlador }