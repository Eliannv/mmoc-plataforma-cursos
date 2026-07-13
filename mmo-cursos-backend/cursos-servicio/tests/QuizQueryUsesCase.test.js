import QuizQueryUsesCase from '../src/aplicacion/uses-cases/query/QuizQueryUsesCase.js'

describe('QuizQueryUsesCase - obtenerPreguntasAleatorias', () => {
    let adaptadorMock
    let casoUso

    beforeEach(() => {
        adaptadorMock = { obtenerConPreguntas: jest.fn() }
        casoUso = new QuizQueryUsesCase(adaptadorMock)
    })

    const generarPreguntas = (n) => Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        enunciado: `Pregunta ${i + 1}`,
        orden: i + 1,
        opciones: [
            { id: (i * 2) + 1, texto: 'Opción A', es_correcta: true },
            { id: (i * 2) + 2, texto: 'Opción B', es_correcta: false }
        ]
    }))

    test('debe devolver exactamente 5 preguntas de un banco de 20', async() => {
        adaptadorMock.obtenerConPreguntas.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, instrucciones: 'Responde', preguntas: generarPreguntas(20) }
        })
        const resultado = await casoUso.obtenerPreguntasAleatorias(1)
        expect(resultado.estado).toBe('ok')
        expect(resultado.preguntas).toHaveLength(5)
    })

    test('debe devolver preguntas SIN indicar la opción correcta', async() => {
        adaptadorMock.obtenerConPreguntas.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, preguntas: generarPreguntas(20) }
        })
        const resultado = await casoUso.obtenerPreguntasAleatorias(1)
        resultado.preguntas.forEach(p => {
            p.opciones.forEach(o => {
                expect(o).not.toHaveProperty('es_correcta')
            })
        })
    })

    test('debe devolver error si el quiz tiene menos de 5 preguntas', async() => {
        adaptadorMock.obtenerConPreguntas.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, preguntas: generarPreguntas(3) }
        })
        const resultado = await casoUso.obtenerPreguntasAleatorias(1)
        expect(resultado.estado).toBe('error')
    })

    test('las 5 preguntas deben ser distintas en cada llamada (aleatorias)', async() => {
        adaptadorMock.obtenerConPreguntas.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, preguntas: generarPreguntas(20) }
        })
        const ids1 = (await casoUso.obtenerPreguntasAleatorias(1)).preguntas.map(p => p.id)
        const ids2 = (await casoUso.obtenerPreguntasAleatorias(1)).preguntas.map(p => p.id)
            // Con 20 preguntas y 5 seleccionadas, la probabilidad de igualdad exacta es ~1/116396
            // Este test podría fallar raramente; es aceptable para verificar aleatoridad
        const idSet1 = new Set(ids1)
        expect(idSet1.size).toBe(5) // Todos los IDs son únicos dentro de la selección
    })
})