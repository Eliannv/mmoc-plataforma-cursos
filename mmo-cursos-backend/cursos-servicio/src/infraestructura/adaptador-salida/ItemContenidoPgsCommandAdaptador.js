import ItemContenidoSalidaCommandPuerto from '../../aplicacion/puertos/salida/ItemContenidoSalidaCommandPuerto.js'
import ModeloItemContenido, { sequelize } from '../modelos/ModeloItemContenido.js'
import ModeloVideo from '../modelos/ModeloVideo.js'
import ModeloDocumento from '../modelos/ModeloDocumento.js'
import ModeloActividadInteractiva from '../modelos/ModeloActividadInteractiva.js'
import ModeloQuiz from '../modelos/ModeloQuiz.js'
import { Transaction } from 'sequelize'

export default class ItemContenidoPgsCommandAdaptador extends ItemContenidoSalidaCommandPuerto {

    guardar = async(item, datosSubRecurso = {}) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const creado = await ModeloItemContenido.create({
                id_seccion: item.getIdSeccion(),
                titulo: item.getTitulo(),
                tipo: item.getTipo(),
                orden: item.getOrden()
            }, { transaction })

            // Crear el sub-recurso según el tipo
            if (item.getTipo() === 'VIDEO') {
                // El video empieza en estado PENDIENTE: storage_key y duracion se asignan
                // cuando el instructor sube el archivo y llama a POST /videos/:id/confirmar
                await ModeloVideo.create({
                    id_item: creado.id,
                    storage_key: null,
                    duracion_segundos: null,
                    estado_procesamiento: 'PENDIENTE'
                }, { transaction })
            } else if (item.getTipo() === 'DOCUMENTO') {
                await ModeloDocumento.create({ id_item: creado.id, url_documento: datosSubRecurso.url_documento, nombre_archivo: datosSubRecurso.nombre_archivo }, { transaction })
            } else if (item.getTipo() === 'ACTIVIDAD_INTERACTIVA') {
                await ModeloActividadInteractiva.create({ id_item: creado.id, instrucciones: datosSubRecurso.instrucciones, url_actividad: datosSubRecurso.url_actividad }, { transaction })
            } else if (item.getTipo() === 'QUIZ') {
                await ModeloQuiz.create({ id_item: creado.id, instrucciones: datosSubRecurso.instrucciones }, { transaction })
            }

            await transaction.commit()
            console.log('✓ Ítem de contenido guardado en la base de datos')
            return { estado: 'ok', ...creado.toJSON() }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }

    editar = async(item, datosProvistos = {}) => {
        const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED })
        try {
            const encontrado = await ModeloItemContenido.findByPk(item.getId(), { transaction })
            if (!encontrado || encontrado.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Ítem no encontrado' }
            }
            const cambios = {}
            if (datosProvistos.hasOwnProperty('titulo')) cambios.titulo = item.getTitulo()
            if (datosProvistos.hasOwnProperty('orden')) cambios.orden = item.getOrden()
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
            const encontrado = await ModeloItemContenido.findByPk(dto.getId(), { transaction })
            if (!encontrado || encontrado.deletedAt !== null) {
                await transaction.rollback()
                return { estado: 'error', resultado: 'Ítem no encontrado' }
            }
            await encontrado.update({ deletedAt: new Date() }, { transaction })
            await transaction.commit()
            return { estado: 'ok', resultado: 'Ítem eliminado correctamente' }
        } catch (error) {
            await transaction.rollback()
            return { estado: 'error', resultado: error.message }
        }
    }
}