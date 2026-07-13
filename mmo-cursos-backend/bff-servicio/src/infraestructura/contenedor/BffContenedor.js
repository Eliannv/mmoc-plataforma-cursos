import { BffControlador } from '../adaptador-entrada/BffControlador.js'
import BffHttpAdaptador from '../adaptador-salida/BffHttpAdaptador.js'

const bffHttpAdaptador = new BffHttpAdaptador()
const bffControlador = new BffControlador(bffHttpAdaptador)

export { bffControlador }