import { PreguntaDTO } from '../../aplicacion/dto/PreguntaDTO.js'
import QuizEntradaPuerto from '../../aplicacion/puertos/entrada/QuizEntradaPuerto.js'

export class QuizControlador extends QuizEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    _ok(res, data, msg, code = 200, ruta = '/api/v1/quizzes') {
        return res.status(code).json({ data, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }
    _error(res, code, tipo, msg, detalles = [], ruta = '/api/v1/quizzes') {
        return res.status(code).json({ error: { code: `${code} ${tipo}`, message: msg, details: detalles }, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    obtenerConPreguntas = async(req, res) => {
        try {
            const { idQuiz } = req.params
            if (!idQuiz || isNaN(parseInt(idQuiz))) return this._error(res, 400, 'ID_INVALIDO', 'El ID del quiz debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.obtenerConPreguntas(parseInt(idQuiz))
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Quiz no encontrado', [], req.path)
            return this._ok(res, resultado, 'Quiz obtenido exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtenerPreguntasAleatorias = async(req, res) => {
        try {
            const { idQuiz } = req.params
            if (!idQuiz || isNaN(parseInt(idQuiz))) return this._error(res, 400, 'ID_INVALIDO', 'El ID del quiz debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.obtenerPreguntasAleatorias(parseInt(idQuiz))
            if (resultado.estado === 'error') return this._error(res, 400, 'ERROR_QUIZ', resultado.resultado, [], req.path)
            return this._ok(res, resultado.preguntas, 'Preguntas seleccionadas para el intento', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    agregarPregunta = async(req, res) => {
        try {
            const idQuiz = req.params.idQuiz || req.body.id_quiz
            const dto = new PreguntaDTO({...req.body, id_quiz: idQuiz ? parseInt(idQuiz) : null })
            try { dto.validarCreacion() } catch (e) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Datos no válidos', e.message.startsWith('[') ? JSON.parse(e.message) : [e.message], req.path)
            }
            const resultado = await this.casoUsoCommand.agregarPregunta(dto)
            if (resultado.estado === 'error') return this._error(res, 400, 'FALLO_CREACION', resultado.resultado, [], req.path)
            return this._ok(res, resultado.pregunta, 'Pregunta agregada al quiz exitosamente', 201, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    obtenerQuizPorItemId = async(req, res) => {
        try {
            const { idItem } = req.params
            if (!idItem || isNaN(parseInt(idItem))) return this._error(res, 400, 'ID_INVALIDO', 'El ID del item debe ser un número', [], req.path)
            const resultado = await this.casoUsoQuery.obtenerPorItem(parseInt(idItem))
            if (!resultado || resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Quiz no encontrado para este item', [], req.path)
            return this._ok(res, resultado.resultado, 'Quiz obtenido exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    eliminarPregunta = async(req, res) => {
        try {
            const { idPregunta } = req.params
            if (!idPregunta || isNaN(parseInt(idPregunta))) return this._error(res, 400, 'ID_INVALIDO', 'El ID de la pregunta debe ser un número', [], req.path)
            const resultado = await this.casoUsoCommand.eliminarPregunta(parseInt(idPregunta))
            if (resultado.estado === 'error') return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            return this._ok(res, null, 'Pregunta eliminada exitosamente', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }

    // POST /api/v1/quizzes/:idQuiz/validar
    // Endpoint interno para que el BFF calcule es_correcta sin exponer las respuestas al frontend.
    // Recibe [{id_pregunta, id_opcion_seleccionada}] y devuelve [{id_pregunta, es_correcta}].
    validarRespuestas = async(req, res) => {
        try {
            const { idQuiz } = req.params
            if (!idQuiz || isNaN(parseInt(idQuiz))) return this._error(res, 400, 'ID_INVALIDO', 'El ID del quiz debe ser un número', [], req.path)
            const { respuestas } = req.body
            if (!respuestas || !Array.isArray(respuestas) || respuestas.length === 0) {
                return this._error(res, 400, 'DATOS_INVALIDOS', 'Se requiere un array de respuestas', [], req.path)
            }

            const resultado = await this.casoUsoQuery.obtenerConPreguntas(parseInt(idQuiz))
            if (!resultado || resultado.estado === 'error') {
                return this._error(res, 404, 'RECURSO_NO_ENCONTRADO', 'Quiz no encontrado', [], req.path)
            }

            // Construir mapa: id_opcion → es_correcta
            const mapaOpciones = new Map();;
            (resultado.preguntas || []).forEach(p => {;
                (p.opciones || []).forEach(o => {
                    mapaOpciones.set(o.id, { id_pregunta: p.id, es_correcta: !!o.es_correcta })
                })
            })

            const validaciones = respuestas.map(r => ({
                id_pregunta: r.id_pregunta,
                es_correcta: (mapaOpciones.get(r.id_opcion_seleccionada) || {}).es_correcta === true
            }))

            return this._ok(res, validaciones, 'Validación completada', 200, req.path)
        } catch (error) {
            return this._error(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico', [error.message], req.path)
        }
    }
}