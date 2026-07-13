import { ProgresoControlador } from '../adaptador-entrada/ProgresoControlador.js'
import ProgresoPgsCommandAdaptador from '../adaptador-salida/ProgresoPgsCommandAdaptador.js'
import ProgresoCommandUsesCase from '../../aplicacion/uses-cases/command/ProgresoCommandUsesCase.js'

const progresoCommandAdaptador = new ProgresoPgsCommandAdaptador()
const casoUsoCommand = new ProgresoCommandUsesCase(progresoCommandAdaptador)
const progresoControlador = new ProgresoControlador(casoUsoCommand)

export { progresoControlador }