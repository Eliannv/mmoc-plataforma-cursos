import QuizCommandUsesCase from '../src/aplicacion/uses-cases/command/QuizCommandUsesCase.js'

describe('QuizCommandUsesCase - agregarPregunta', () => {
    let commandAdaptadorMock
    let queryAdaptadorMock
    let casoUso

    beforeEach(() => {
        commandAdaptadorMock = { agregarPregunta: jest.fn(), eliminarPregunta: jest.fn() }
        queryAdaptadorMock = { contarPreguntas: jest.fn() }
        casoUso = new QuizCommandUsesCase(commandAdaptadorMock, queryAdaptadorMock)
    })

    test('debe rechazar si ya hay 20 preguntas en el quiz', async() => {
        queryAdaptadorMock.contarPreguntas.mockResolvedValue(20)
        const dto = {
            getIdQuiz: () => 1,
            getEnunciado: () => '¿Pregunta 21?',
            getOrden: () => 21,
            getOpciones: () => [{ texto: 'Opción A', es_correcta: true }, { texto: 'Opción B', es_correcta: false }]
        }
        const resultado = await casoUso.agregarPregunta(dto)
        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('máximo de 20')
        expect(commandAdaptadorMock.agregarPregunta).not.toHaveBeenCalled()
    })

    test('debe agregar la pregunta si hay menos de 20', async() => {
        queryAdaptadorMock.contarPreguntas.mockResolvedValue(5)
        commandAdaptadorMock.agregarPregunta.mockResolvedValue({
            estado: 'ok',
            pregunta: { id: 6, enunciado: '¿Pregunta nueva?', opciones: [] }
        })
        const dto = {
            getIdQuiz: () => 1,
            getEnunciado: () => '¿Pregunta nueva?',
            getOrden: () => 6,
            getOpciones: () => [{ texto: 'Sí', es_correcta: true }, { texto: 'No', es_correcta: false }]
        }
        const resultado = await casoUso.agregarPregunta(dto)
        expect(resultado.estado).toBe('ok')
        expect(commandAdaptadorMock.agregarPregunta).toHaveBeenCalledTimes(1)
    })
})