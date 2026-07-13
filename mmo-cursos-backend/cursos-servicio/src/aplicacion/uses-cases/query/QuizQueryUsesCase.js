const PREGUNTAS_POR_INTENTO = 5

export default class QuizQueryUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async obtenerConPreguntas(idQuiz) {
        const respuesta = await this.adaptadorBDSalida.obtenerConPreguntas(idQuiz)
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Quiz no encontrado' }
        return respuesta.resultado
    }

    // Devuelve 5 preguntas aleatorias del banco de 20 para un intento de estudiante
    async obtenerPorItem(idItem) {
        return await this.adaptadorBDSalida.obtenerPorItem(idItem)
    }

    async obtenerPreguntasAleatorias(idQuiz) {
        const respuesta = await this.adaptadorBDSalida.obtenerConPreguntas(idQuiz)
        if (respuesta.estado === 'error') return { estado: 'error', resultado: 'Quiz no encontrado' }

        const todasLasPreguntas = respuesta.resultado.preguntas || []
        if (todasLasPreguntas.length < PREGUNTAS_POR_INTENTO) {
            return { estado: 'error', resultado: `El quiz necesita al menos ${PREGUNTAS_POR_INTENTO} preguntas para iniciar un intento` }
        }

        const mezcladas = [...todasLasPreguntas].sort(() => Math.random() - 0.5)
        const seleccionadas = mezcladas.slice(0, PREGUNTAS_POR_INTENTO)

        // Para el estudiante: se devuelven las preguntas SIN indicar cuál es la correcta
        const preguntasParaEstudiante = seleccionadas.map(p => ({
            id: p.id,
            enunciado: p.enunciado,
            orden: p.orden,
            opciones: (p.opciones || []).map(o => ({ id: o.id, texto: o.texto }))
        }))

        return { estado: 'ok', preguntas: preguntasParaEstudiante }
    }
}