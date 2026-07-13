import { InscripcionControlador } from '../adaptador-entrada/InscripcionControlador.js'
import InscripcionPgsCommandAdaptador from '../adaptador-salida/InscripcionPgsCommandAdaptador.js'
import InscripcionPgsQueryAdaptador from '../adaptador-salida/InscripcionPgsQueryAdaptador.js'
import ProgresoPgsQueryAdaptador from '../adaptador-salida/ProgresoPgsQueryAdaptador.js'
import InscripcionCommandUsesCase from '../../aplicacion/uses-cases/command/InscripcionCommandUsesCase.js'
import InscripcionQueryUsesCase from '../../aplicacion/uses-cases/query/InscripcionQueryUsesCase.js'

const inscripcionCommandAdaptador = new InscripcionPgsCommandAdaptador()
const inscripcionQueryAdaptador = new InscripcionPgsQueryAdaptador()
const progresoQueryAdaptador = new ProgresoPgsQueryAdaptador()

const casoUsoCommand = new InscripcionCommandUsesCase(inscripcionCommandAdaptador, inscripcionQueryAdaptador)
const casoUsoQuery = new InscripcionQueryUsesCase(inscripcionQueryAdaptador, progresoQueryAdaptador)

const inscripcionControlador = new InscripcionControlador(casoUsoCommand, casoUsoQuery)

export { inscripcionControlador }