import CursoSalidaCommandPuerto from '../../aplicacion/puertos/salida/CursoSalidaCommandPuerto.js'
import ModeloCurso, { sequelize } from '../modelos/ModeloCurso.js'
import { Transaction } from 'sequelize'

export default class CursoPgsCommandAdaptador extends CursoSalidaCommandPuerto {

    guardar = async(curso) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const creado = await ModeloCurso.create({
                titulo: curso.getTitulo(),
                descripcion: curso.getDescripcion(),
                nivel: curso.getNivel(),
                estado: 'BORRADOR',
                id_categoria: curso.getIdCategoria(),
                id_instructor: curso.getIdInstructor(),
                duracion_total_minutos: 0
            }, { transaction })
            await transaction.commit()
            console.log('✓ Curso guardado en la base de datos')
            return { estado: 'ok', ...creado.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    editar = async(curso, datosProvistos = {}) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrado = await ModeloCurso.findByPk(curso.getId(), { transaction })
            if (!encontrado || encontrado.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Curso no encontrado' }
            }
            const cambios = {}
            if (datosProvistos.hasOwnProperty('titulo')) cambios.titulo = curso.getTitulo()
            if (datosProvistos.hasOwnProperty('descripcion')) cambios.descripcion = curso.getDescripcion()
            if (datosProvistos.hasOwnProperty('nivel')) cambios.nivel = curso.getNivel()
            if (datosProvistos.hasOwnProperty('id_categoria')) cambios.id_categoria = curso.getIdCategoria()
            await encontrado.update(cambios, { transaction })
            await transaction.commit()
            return { estado: 'ok', ...encontrado.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    eliminar = async(dto) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrado = await ModeloCurso.findByPk(dto.getId(), { transaction })
            if (!encontrado || encontrado.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Curso no encontrado' }
            }
            await encontrado.update({ deletedAt: new Date() }, { transaction })
            await transaction.commit()
            return { estado: 'ok', resultado: 'Curso eliminado correctamente' }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    cambiarEstado = async(id, estado) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrado = await ModeloCurso.findByPk(id, { transaction })
            if (!encontrado || encontrado.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Curso no encontrado' }
            }
            await encontrado.update({ estado }, { transaction })
            await transaction.commit()
            return { estado: 'ok', ...encontrado.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}