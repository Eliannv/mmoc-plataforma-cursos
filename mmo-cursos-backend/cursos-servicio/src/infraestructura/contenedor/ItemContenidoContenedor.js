import { ItemContenidoControlador } from '../adaptador-entrada/ItemContenidoControlador.js'
import ItemContenidoPgsCommandAdaptador from '../adaptador-salida/ItemContenidoPgsCommandAdaptador.js'
import ItemContenidoPgsQueryAdaptador from '../adaptador-salida/ItemContenidoPgsQueryAdaptador.js'
import ItemContenidoCommandUsesCase from '../../aplicacion/uses-cases/command/ItemContenidoCommandUsesCase.js'
import ItemContenidoQueryUsesCase from '../../aplicacion/uses-cases/query/ItemContenidoQueryUsesCase.js'

const itemCommandAdaptador = new ItemContenidoPgsCommandAdaptador()
const itemQueryAdaptador = new ItemContenidoPgsQueryAdaptador()
const casoUsoCommand = new ItemContenidoCommandUsesCase(itemCommandAdaptador)
const casoUsoQuery = new ItemContenidoQueryUsesCase(itemQueryAdaptador)
const itemContenidoControlador = new ItemContenidoControlador(casoUsoCommand, casoUsoQuery)

export { itemContenidoControlador }