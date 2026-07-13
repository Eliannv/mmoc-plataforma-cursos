import DocumentoCommandAdaptador from '../adaptador-salida/DocumentoPgsCommandAdaptador.js'
import DocumentoQueryAdaptador from '../adaptador-salida/DocumentoPgsQueryAdaptador.js'
import AlmacenamientoMinioAdaptador from '../adaptador-salida/AlmacenamientoMinioAdaptador.js'
import AlmacenamientoS3Adaptador from '../adaptador-salida/AlmacenamientoS3Adaptador.js'
import AlmacenamientoLocalAdaptador from '../adaptador-salida/AlmacenamientoLocalAdaptador.js'
import SolicitarSubidaDocumentoCommandUsesCase from '../../aplicacion/uses-cases/command/SolicitarSubidaDocumentoCommandUsesCase.js'
import ConfirmarDocumentoCommandUsesCase from '../../aplicacion/uses-cases/command/ConfirmarDocumentoCommandUsesCase.js'
import ObtenerUrlDescargaDocumentoQueryUsesCase from '../../aplicacion/uses-cases/query/ObtenerUrlDescargaDocumentoQueryUsesCase.js'
import { DocumentoControlador } from '../adaptador-entrada/DocumentoControlador.js'

const almacenamiento =
    process.env.STORAGE_PROVIDER === 'minio' ?
    new AlmacenamientoMinioAdaptador() :
    process.env.STORAGE_PROVIDER === 's3' ?
    new AlmacenamientoS3Adaptador() :
    new AlmacenamientoLocalAdaptador()

const docCommandAdaptador = new DocumentoCommandAdaptador()
const docQueryAdaptador = new DocumentoQueryAdaptador()

const solicitarSubidaCasoUso = new SolicitarSubidaDocumentoCommandUsesCase(docQueryAdaptador, almacenamiento)
const confirmarCasoUso = new ConfirmarDocumentoCommandUsesCase(docCommandAdaptador, docQueryAdaptador)
const obtenerUrlDescargaCasoUso = new ObtenerUrlDescargaDocumentoQueryUsesCase(docQueryAdaptador, almacenamiento)

const documentoControlador = new DocumentoControlador(solicitarSubidaCasoUso, confirmarCasoUso, obtenerUrlDescargaCasoUso)

export { documentoControlador }