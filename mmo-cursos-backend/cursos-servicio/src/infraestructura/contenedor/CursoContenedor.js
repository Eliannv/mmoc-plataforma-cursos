import { CursoControlador } from '../adaptador-entrada/CursoControlador.js'
import CursoPgsCommandAdaptador from '../adaptador-salida/CursoPgsCommandAdaptador.js'
import CursoPgsQueryAdaptador from '../adaptador-salida/CursoPgsQueryAdaptador.js'
import CursoCommandUsesCase from '../../aplicacion/uses-cases/command/CursoCommandUsesCase.js'
import CursoQueryUsesCase from '../../aplicacion/uses-cases/query/CursoQueryUsesCase.js'

const cursoCommandAdaptador = new CursoPgsCommandAdaptador()
const cursoQueryAdaptador = new CursoPgsQueryAdaptador()
const casoUsoCommand = new CursoCommandUsesCase(cursoCommandAdaptador)
const casoUsoQuery = new CursoQueryUsesCase(cursoQueryAdaptador)
const cursoControlador = new CursoControlador(casoUsoCommand, casoUsoQuery)

export { cursoControlador }