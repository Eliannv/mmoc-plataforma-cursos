import ActividadPgsCommandAdaptador from '../adaptador-salida/ActividadPgsCommandAdaptador.js'
import { Router } from 'express'
import { jwtMiddleware } from '../middleware/JwtMiddleware.js'

// Controlador inline para actividades (sencillo, sin caso de uso independiente)
class ActividadControlador {
    constructor(adaptador) {
        this.adaptador = adaptador
    }

    _ok(res, data, msg, code = 200) {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: res.req.path } })
    }
    _error(res, code, tipo, msg, detalles = []) {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: res.req.path } })
    }

    // PUT /api/v1/actividades/:idItem
    actualizar = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) {
                return this._error(res, 400, 'ID_INVALIDO', 'El ID del ítem debe ser un número')
            }
            const { tipo, config } = req.body
            const tiposValidos = ['escenario_decision', 'verdadero_falso', 'reflexion_abierta']
            if (!tipo || !tiposValidos.includes(tipo)) {
                return this._error(res, 400, 'TIPO_INVALIDO', `El tipo debe ser uno de: ${tiposValidos.join(', ')}`)
            }
            if (!config || typeof config !== 'object') {
                return this._error(res, 400, 'CONFIG_INVALIDA', 'Se requiere un objeto config')
            }
            const resultado = await this.adaptador.guardarConfig(parseInt(idItem), tipo, config)
            if (resultado.estado === 'error') {
                return this._error(res, 400, 'FALLO_ACTUALIZAR', resultado.resultado)
            }
            return this._ok(res, resultado, 'Actividad interactiva actualizada exitosamente')
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message])
        }
    }
}

const actividadControlador = new ActividadControlador(new ActividadPgsCommandAdaptador())

const router = Router()
router.put('/:idItem', jwtMiddleware(['INSTRUCTOR', 'ADMIN']), actividadControlador.actualizar)

export default router