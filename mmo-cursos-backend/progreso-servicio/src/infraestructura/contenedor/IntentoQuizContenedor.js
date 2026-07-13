import { IntentoQuizControlador } from '../adaptador-entrada/IntentoQuizControlador.js'
import IntentoQuizPgsCommandAdaptador from '../adaptador-salida/IntentoQuizPgsCommandAdaptador.js'
import IntentoQuizPgsQueryAdaptador from '../adaptador-salida/IntentoQuizPgsQueryAdaptador.js'
import IntentoQuizCommandUsesCase from '../../aplicacion/uses-cases/command/IntentoQuizCommandUsesCase.js'
import IntentoQuizQueryUsesCase from '../../aplicacion/uses-cases/query/IntentoQuizQueryUsesCase.js'

const intentoCommandAdaptador = new IntentoQuizPgsCommandAdaptador()
const intentoQueryAdaptador = new IntentoQuizPgsQueryAdaptador()
const casoUsoCommand = new IntentoQuizCommandUsesCase(intentoCommandAdaptador)
const casoUsoQuery = new IntentoQuizQueryUsesCase(intentoQueryAdaptador)
const intentoQuizControlador = new IntentoQuizControlador(casoUsoCommand, casoUsoQuery)

export { intentoQuizControlador }