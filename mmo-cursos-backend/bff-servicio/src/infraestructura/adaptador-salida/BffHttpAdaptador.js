// Adaptador HTTP que consume auth-servicio, cursos-servicio y progreso-servicio
export default class BffHttpAdaptador {
    constructor() {
        this.authUrl = process.env.AUTH_SERVICIO_URL || 'http://localhost:3001'
        this.cursosUrl = process.env.CURSOS_SERVICIO_URL || 'http://localhost:3002'
        this.progresoUrl = process.env.PROGRESO_SERVICIO_URL || 'http://localhost:3003'
    }

    // ── Helpers ──────────────────────────────────────────────
    _headers(token) {
        return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    }

    async _get(url, token) {
        const res = await fetch(url, { headers: this._headers(token) })
        const json = await res.json()
        return { ok: res.ok, status: res.status, body: json }
    }

    async _post(url, body, token) {
        const res = await fetch(url, { method: 'POST', headers: this._headers(token), body: JSON.stringify(body) })
        const json = await res.json()
        return { ok: res.ok, status: res.status, body: json }
    }

    async _put(url, body, token) {
        const res = await fetch(url, { method: 'PUT', headers: this._headers(token), body: JSON.stringify(body || {}) })
        const json = await res.json()
        return { ok: res.ok, status: res.status, body: json }
    }

    async _delete(url, token) {
        const res = await fetch(url, { method: 'DELETE', headers: this._headers(token) })
        const json = await res.json()
        return { ok: res.ok, status: res.status, body: json }
    }

    async _patch(url, body, token) {
        const res = await fetch(url, { method: 'PATCH', headers: this._headers(token), body: JSON.stringify(body || {}) })
        const json = await res.json()
        return { ok: res.ok, status: res.status, body: json }
    }

    // ── AUTH ──────────────────────────────────────────────────
    registrarUsuario = async(datos) => this._post(`${this.authUrl}/api/v1/auth/registro`, datos, null)
    loginUsuario = async(datos) => this._post(`${this.authUrl}/api/v1/auth/login`, datos, null)
    obtenerPerfilUsuario = async(token) => this._get(`${this.authUrl}/api/v1/auth/perfil`, token)

    // ── CATEGORÍAS ────────────────────────────────────────────
    listarCategorias = async(token) => this._get(`${this.cursosUrl}/api/v1/categorias`, token)
    crearCategoria = async(datos, token) => this._post(`${this.cursosUrl}/api/v1/categorias`, datos, token)
    obtenerCategoria = async(id, token) => this._get(`${this.cursosUrl}/api/v1/categorias/${id}`, token)

    // ── CURSOS ────────────────────────────────────────────────
    obtenerCursoPublico = async(id) => this._get(`${this.cursosUrl}/api/v1/cursos/${id}/publico`, null)
    listarCursosPublicos = async(query) => {
        const qs = new URLSearchParams(query).toString()
        return this._get(`${this.cursosUrl}/api/v1/cursos/publicos${qs ? '?' + qs : ''}`, null)
    }

    listarCursos = async(query, token) => {
        const qs = new URLSearchParams(query).toString()
        return this._get(`${this.cursosUrl}/api/v1/cursos${qs ? '?' + qs : ''}`, token)
    }
    crearCurso = async(datos, token) => this._post(`${this.cursosUrl}/api/v1/cursos`, datos, token)
    obtenerCurso = async(id, token) => this._get(`${this.cursosUrl}/api/v1/cursos/${id}`, token)
    actualizarCurso = async(id, datos, token) => this._put(`${this.cursosUrl}/api/v1/cursos/${id}`, datos, token)
    publicarCurso = async(id, token) => this._put(`${this.cursosUrl}/api/v1/cursos/${id}/publicar`, {}, token)
    despublicarCurso = async(id, token) => this._put(`${this.cursosUrl}/api/v1/cursos/${id}/despublicar`, {}, token)
    listarCursosPorCategoria = async(idCategoria, token) => this._get(`${this.cursosUrl}/api/v1/cursos/categoria/${idCategoria}`, token)

    // ── SECCIONES ─────────────────────────────────────────────
    listarSecciones = async(idCurso, token) => this._get(`${this.cursosUrl}/api/v1/cursos/${idCurso}/secciones`, token)
    crearSeccion = async(idCurso, datos, token) => this._post(`${this.cursosUrl}/api/v1/cursos/${idCurso}/secciones`, datos, token)

    // ── ITEMS DE CONTENIDO ────────────────────────────────────
    listarItems = async(idSeccion, token) => this._get(`${this.cursosUrl}/api/v1/secciones/${idSeccion}/items`, token)
    crearItem = async(idSeccion, datos, token) => this._post(`${this.cursosUrl}/api/v1/secciones/${idSeccion}/items`, datos, token)

    // ── QUIZZES ───────────────────────────────────────────────
    obtenerQuizConPreguntas = async(idQuiz, token) => this._get(`${this.cursosUrl}/api/v1/quizzes/${idQuiz}/preguntas`, token)
    obtenerPreguntasAleatorias = async(idQuiz, token) => this._get(`${this.cursosUrl}/api/v1/quizzes/${idQuiz}/preguntas/aleatorias`, token)
    agregarPregunta = async(idQuiz, datos, token) => this._post(`${this.cursosUrl}/api/v1/quizzes/${idQuiz}/preguntas`, datos, token)

    // ── INSCRIPCIONES ─────────────────────────────────────────
    inscribirse = async(datos, token) => this._post(`${this.progresoUrl}/api/v1/inscripciones`, datos, token)
    listarMisInscripciones = async(token) => this._get(`${this.progresoUrl}/api/v1/inscripciones`, token)
    obtenerProgresoCurso = async(idCurso, token) => this._get(`${this.progresoUrl}/api/v1/inscripciones/cursos/${idCurso}/progreso`, token)

    // ── PROGRESO ──────────────────────────────────────────────
    marcarAvance = async(datos, token) => this._post(`${this.progresoUrl}/api/v1/progreso`, datos, token)

    // ── INTENTOS DE QUIZ ─────────────────────────────────────
    iniciarIntento = async(datos, token) => this._post(`${this.progresoUrl}/api/v1/intentos`, datos, token)
    obtenerIntento = async(id, token) => this._get(`${this.progresoUrl}/api/v1/intentos/${id}`, token)
    registrarRespuestas = async(id, datos, token) => this._post(`${this.progresoUrl}/api/v1/intentos/${id}/respuestas`, datos, token)

    // ── VIDEOS (presigned URLs) ───────────────────────────────
    solicitarUrlSubidaVideo = async(idItem, token) => this._get(`${this.cursosUrl}/api/v1/videos/${idItem}/url-subida`, token)
    confirmarSubidaVideo = async(idItem, token) => this._post(`${this.cursosUrl}/api/v1/videos/${idItem}/confirmar`, {}, token)
    obtenerUrlDescargaVideo = async(idItem, token) => this._get(`${this.cursosUrl}/api/v1/videos/${idItem}/url-descarga`, token)

    // ── DOCUMENTOS (presigned URLs) ───────────────────────────
    solicitarUrlSubidaDocumento = async(idItem, query, token) => {
        const qs = new URLSearchParams(query).toString()
        return this._get(`${this.cursosUrl}/api/v1/documentos/${idItem}/url-subida${qs ? '?' + qs : ''}`, token)
    }
    confirmarSubidaDocumento = async(idItem, datos, token) => this._post(`${this.cursosUrl}/api/v1/documentos/${idItem}/confirmar`, datos, token)
    obtenerUrlDescargaDocumento = async(idItem, token) => this._get(`${this.cursosUrl}/api/v1/documentos/${idItem}/url-descarga`, token)

    // ── ACTIVIDADES INTERACTIVAS ──────────────────────────────
    actualizarActividad = async(idItem, datos, token) => this._put(`${this.cursosUrl}/api/v1/actividades/${idItem}`, datos, token)

    // ── USUARIOS (admin) ──────────────────────────────────────
    listarUsuarios = async(query, token) => {
        const qs = new URLSearchParams(query).toString()
        return this._get(`${this.authUrl}/api/v1/usuarios${qs ? '?' + qs : ''}`, token)
    }
    cambiarRolUsuario = async(id, datos, token) => this._patch(`${this.authUrl}/api/v1/usuarios/${id}/rol`, datos, token)

    // ── QUIZ VALIDAR RESPUESTAS (interno BFF) ─────────────────
    validarRespuestasQuiz = async(idQuiz, respuestas, token) => this._post(`${this.cursosUrl}/api/v1/quizzes/${idQuiz}/validar`, { respuestas }, token)
}