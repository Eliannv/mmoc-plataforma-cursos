import { AuthControlador } from '../adaptador-entrada/AuthControlador.js'
import AuthPgsCommandAdaptador from '../adaptador-salida/AuthPgsCommandAdaptador.js'
import AuthPgsQueryAdaptador from '../adaptador-salida/AuthPgsQueryAdaptador.js'
import AuthCommandUsesCase from '../../aplicacion/uses-cases/command/AuthCommandUsesCase.js'
import AuthQueryUsesCase from '../../aplicacion/uses-cases/query/AuthQueryUsesCase.js'

const authCommandAdaptador = new AuthPgsCommandAdaptador()
const authQueryAdaptador = new AuthPgsQueryAdaptador()

const casoUsoCommand = new AuthCommandUsesCase(authCommandAdaptador)
const casoUsoQuery = new AuthQueryUsesCase(authQueryAdaptador)

const authControlador = new AuthControlador(casoUsoCommand, casoUsoQuery)

export { authControlador }