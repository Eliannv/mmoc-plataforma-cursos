import { CategoriaControlador } from '../adaptador-entrada/CategoriaControlador.js'
import CategoriaPgsCommandAdaptador from '../adaptador-salida/CategoriaPgsCommandAdaptador.js'
import CategoriaPgsQueryAdaptador from '../adaptador-salida/CategoriaPgsQueryAdaptador.js'
import CategoriaCommandUsesCase from '../../aplicacion/uses-cases/command/CategoriaCommandUsesCase.js'
import CategoriaQueryUsesCase from '../../aplicacion/uses-cases/query/CategoriaQueryUsesCase.js'

const categoriaCommandAdaptador = new CategoriaPgsCommandAdaptador()
const categoriaQueryAdaptador = new CategoriaPgsQueryAdaptador()
const casoUsoCommand = new CategoriaCommandUsesCase(categoriaCommandAdaptador)
const casoUsoQuery = new CategoriaQueryUsesCase(categoriaQueryAdaptador)
const categoriaControlador = new CategoriaControlador(casoUsoCommand, casoUsoQuery)

export { categoriaControlador }