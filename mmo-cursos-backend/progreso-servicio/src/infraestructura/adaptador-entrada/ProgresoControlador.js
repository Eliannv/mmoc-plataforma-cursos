import { ProgresoDTO } from '../../aplicacion/dto/ProgresoDTO.js'
import ProgresoEntradaPuerto from '../../aplicacion/puertos/entrada/ProgresoEntradaPuerto.js'

export class ProgresoControlador extends ProgresoEntradaPuerto {
    constructor(casoUsoCommand) {
        super()
        this.casoUsoCommand = casoUsoCommand
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/progreso') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/progreso') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    marcarAvance = async(req, res) => {
        try {
            const dto = new ProgresoDTO(req.body || {})
            try { dto.validarMarcado() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.marcarAvance(dto)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_AVANCE', resultado.resultado, [], req.path)
            return this._ok(res, resultado, 'Avance registrado exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}