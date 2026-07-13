import { SeccionControlador } from '../adaptador-entrada/SeccionControlador.js'
import SeccionPgsCommandAdaptador from '../adaptador-salida/SeccionPgsCommandAdaptador.js'
import SeccionPgsQueryAdaptador from '../adaptador-salida/SeccionPgsQueryAdaptador.js'
import SeccionCommandUsesCase from '../../aplicacion/uses-cases/command/SeccionCommandUsesCase.js'
import SeccionQueryUsesCase from '../../aplicacion/uses-cases/query/SeccionQueryUsesCase.js'

const seccionCommandAdaptador = new SeccionPgsCommandAdaptador()
const seccionQueryAdaptador = new SeccionPgsQueryAdaptador()
const casoUsoCommand = new SeccionCommandUsesCase(seccionCommandAdaptador)
const casoUsoQuery = new SeccionQueryUsesCase(seccionQueryAdaptador)
const seccionControlador = new SeccionControlador(casoUsoCommand, casoUsoQuery)

export { seccionControlador }