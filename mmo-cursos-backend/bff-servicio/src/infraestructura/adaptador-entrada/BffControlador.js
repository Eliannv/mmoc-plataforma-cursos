export class BffControlador {
    constructor(bffHttpAdaptador) {
        this.bff = bffHttpAdaptador
    }

    _ok(res, cuerpo, msg, code = 200, ruta = '') {
        return res.status(code).json({ data: cuerpo, message: msg, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    _proxy(res, respuestaServicio, ruta = '') {
        return res.status(respuestaServicio.status).json({...respuestaServicio.body, meta: { traceId: res.req.traceId || 'N/A', timestamp: new Date().toISOString(), path: ruta } })
    }

    _token(req) {
        const h = req.headers['authorization']
        return h && h.startsWith('Bearer ') ? h.split(' ')[1] : null
    }

    // ── AUTH ──────────────────────────────────────────────────
    registrar = async(req, res) => {
        try {
            const resp = await this.bff.registrarUsuario(req.body)
            return this._proxy(res, resp, req.path)
        } catch (error) {
            return res.status(502).json({ error: { code: '502 BFF_ERROR', message: error.message } })
        }
    }

    login = async(req, res) => {
        try {
            const resp = await this.bff.loginUsuario(req.body)
            return this._proxy(res, resp, req.path)
        } catch (error) {
            return res.status(502).json({ error: { code: '502 BFF_ERROR', message: error.message } })
        }
    }

    perfil = async(req, res) => {
        try {
            const resp = await this.bff.obtenerPerfilUsuario(this._token(req))
            return this._proxy(res, resp, req.path)
        } catch (error) {
            return res.status(502).json({ error: { code: '502 BFF_ERROR', message: error.message } })
        }
    }

    // ── CATEGORÍAS ────────────────────────────────────────────
    listarCategorias = async(req, res) => {
        const resp = await this.bff.listarCategorias(this._token(req))
        return this._proxy(res, resp, req.path)
    }

    crearCategoria = async(req, res) => {
        const resp = await this.bff.crearCategoria(req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerCategoria = async(req, res) => {
        const resp = await this.bff.obtenerCategoria(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    actualizarCategoria = async(req, res) => {
        const resp = await this.bff.actualizarCategoria(req.params.id, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    eliminarCategoria = async(req, res) => {
        const resp = await this.bff.eliminarCategoria(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── CURSOS ────────────────────────────────────────────────
    obtenerCursoPublico = async(req, res) => {
        const resp = await this.bff.obtenerCursoPublico(req.params.id)
        return this._proxy(res, resp, req.path)
    }

    listarCursosPublicos = async(req, res) => {
        const resp = await this.bff.listarCursosPublicos(req.query)
        return this._proxy(res, resp, req.path)
    }

    listarCursos = async(req, res) => {
        const resp = await this.bff.listarCursos(req.query, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    crearCurso = async(req, res) => {
        const resp = await this.bff.crearCurso(req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerCurso = async(req, res) => {
        const resp = await this.bff.obtenerCurso(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    actualizarCurso = async(req, res) => {
        const resp = await this.bff.actualizarCurso(req.params.id, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    eliminarCurso = async(req, res) => {
        const resp = await this.bff.eliminarCurso(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    publicarCurso = async(req, res) => {
        const resp = await this.bff.publicarCurso(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    despublicarCurso = async(req, res) => {
        const resp = await this.bff.despublicarCurso(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    listarCursosPorCategoria = async(req, res) => {
        const resp = await this.bff.listarCursosPorCategoria(req.params.idCategoria, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── SECCIONES ─────────────────────────────────────────────
    listarSecciones = async(req, res) => {
        const resp = await this.bff.listarSecciones(req.params.idCurso, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    crearSeccion = async(req, res) => {
        const resp = await this.bff.crearSeccion(req.params.idCurso, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerSeccion = async(req, res) => {
        const resp = await this.bff.obtenerSeccion(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    actualizarSeccion = async(req, res) => {
        const resp = await this.bff.actualizarSeccion(req.params.id, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    eliminarSeccion = async(req, res) => {
        const resp = await this.bff.eliminarSeccion(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── ITEMS ─────────────────────────────────────────────────
    listarItems = async(req, res) => {
        const resp = await this.bff.listarItems(req.params.idSeccion, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    crearItem = async(req, res) => {
        const resp = await this.bff.crearItem(req.params.idSeccion, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerItem = async(req, res) => {
        const resp = await this.bff.obtenerItem(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    actualizarItem = async(req, res) => {
        const resp = await this.bff.actualizarItem(req.params.id, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    eliminarItem = async(req, res) => {
        const resp = await this.bff.eliminarItem(req.params.id, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── QUIZZES ───────────────────────────────────────────────
    agregarPregunta = async(req, res) => {
        const resp = await this.bff.agregarPregunta(req.params.idQuiz, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerQuizConPreguntas = async(req, res) => {
        const resp = await this.bff.obtenerQuizConPreguntas(req.params.idQuiz, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    eliminarPregunta = async(req, res) => {
        const resp = await this.bff.eliminarPregunta(req.params.idQuiz, req.params.idPregunta, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── FLUJO ORQUESTADO: iniciar intento de quiz ─────────────
    // BFF obtiene las 5 preguntas aleatorias del cursos-servicio
    // y luego crea el intento en progreso-servicio
    iniciarIntentoQuiz = async(req, res) => {
        try {
            const token = this._token(req)
            const { id_inscripcion, id_quiz } = req.body

            if (!id_inscripcion || !id_quiz) {
                return res.status(400).json({ error: { code: '400 DATOS_INVALIDOS', message: 'Se requieren id_inscripcion e id_quiz', details: [] } })
            }

            // Paso 1: obtener 5 preguntas aleatorias del banco
            const preguntasResp = await this.bff.obtenerPreguntasAleatorias(id_quiz, token)
            if (!preguntasResp.ok) {
                return this._proxy(res, preguntasResp, req.path)
            }

            const preguntasRaw = preguntasResp.body.data || []
            const ids_preguntas = preguntasRaw.map(p => p.id)

            // Paso 2: crear el intento en progreso-servicio con las IDs seleccionadas
            const intentoResp = await this.bff.iniciarIntento({ id_inscripcion, id_quiz, ids_preguntas }, token)
            if (!intentoResp.ok) {
                return this._proxy(res, intentoResp, req.path)
            }

            // Devolver el intento con preguntas SIN es_correcta en las opciones
            const preguntas = preguntasRaw.map(p => ({
                ...p,
                opciones: (p.opciones || []).map(({ es_correcta, ...opcion }) => opcion)
            }))

            return this._ok(res, { intento: intentoResp.body.data, preguntas }, 'Intento iniciado — responde las 5 preguntas', 201, req.path)
        } catch (error) {
            return res.status(502).json({ error: { code: '502 BFF_ERROR', message: error.message } })
        }
    }

    // ── FLUJO ORQUESTADO: registrar respuestas con validación de correctas ─────
    // BFF llama a cursos-servicio para validar cuáles son correctas, sin exponer la clave al frontend
    registrarRespuestasIntento = async(req, res) => {
        try {
            const token = this._token(req)
            const { id } = req.params
            const { respuestas, id_quiz } = req.body

            if (!respuestas || !id_quiz) {
                return res.status(400).json({ error: { code: '400 DATOS_INVALIDOS', message: 'Se requieren respuestas e id_quiz', details: [] } })
            }

            // Paso 1: validar cuáles son correctas mediante endpoint interno de cursos-servicio
            const validacionResp = await this.bff.validarRespuestasQuiz(id_quiz, respuestas, token)
            if (!validacionResp.ok) {
                return this._proxy(res, validacionResp, req.path)
            }

            const validaciones = validacionResp.body.data || []
            const mapaCorrectas = new Map(validaciones.map(v => [v.id_pregunta, v.es_correcta]))

            const respuestasValidadas = respuestas.map(r => ({
                ...r,
                es_correcta: mapaCorrectas.get(r.id_pregunta) === true
            }))

            // Paso 2: enviar respuestas con es_correcta calculado al progreso-servicio
            const resultado = await this.bff.registrarRespuestas(id, { respuestas: respuestasValidadas }, token)
            return this._proxy(res, resultado, req.path)
        } catch (error) {
            return res.status(502).json({ error: { code: '502 BFF_ERROR', message: error.message } })
        }
    }

    // ── INSCRIPCIONES ─────────────────────────────────────────
    inscribirse = async(req, res) => {
        const resp = await this.bff.inscribirse(req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    listarMisInscripciones = async(req, res) => {
        const resp = await this.bff.listarMisInscripciones(this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerProgresoCurso = async(req, res) => {
        const resp = await this.bff.obtenerProgresoCurso(req.params.idCurso, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    marcarAvance = async(req, res) => {
        const resp = await this.bff.marcarAvance(req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── VIDEOS ────────────────────────────────────────────────
    solicitarUrlSubidaVideo = async(req, res) => {
        const resp = await this.bff.solicitarUrlSubidaVideo(req.params.idItem, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    confirmarSubidaVideo = async(req, res) => {
        const resp = await this.bff.confirmarSubidaVideo(req.params.idItem, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerUrlDescargaVideo = async(req, res) => {
        const resp = await this.bff.obtenerUrlDescargaVideo(req.params.idItem, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── DOCUMENTOS ────────────────────────────────────────────
    solicitarUrlSubidaDocumento = async(req, res) => {
        const resp = await this.bff.solicitarUrlSubidaDocumento(req.params.idItem, req.query, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    confirmarSubidaDocumento = async(req, res) => {
        const resp = await this.bff.confirmarSubidaDocumento(req.params.idItem, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    obtenerUrlDescargaDocumento = async(req, res) => {
        const resp = await this.bff.obtenerUrlDescargaDocumento(req.params.idItem, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── ACTIVIDADES INTERACTIVAS ──────────────────────────────
    actualizarActividad = async(req, res) => {
        const resp = await this.bff.actualizarActividad(req.params.idItem, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    // ── USUARIOS (admin) ──────────────────────────────────────
    listarUsuarios = async(req, res) => {
        const resp = await this.bff.listarUsuarios(req.query, this._token(req))
        return this._proxy(res, resp, req.path)
    }

    cambiarRolUsuario = async(req, res) => {
        const resp = await this.bff.cambiarRolUsuario(req.params.id, req.body, this._token(req))
        return this._proxy(res, resp, req.path)
    }
}