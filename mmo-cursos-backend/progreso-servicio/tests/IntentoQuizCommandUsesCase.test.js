import IntentoQuizCommandUsesCase from '../src/aplicacion/uses-cases/command/IntentoQuizCommandUsesCase.js'

describe('IntentoQuizCommandUsesCase', () => {
    let commandAdaptadorMock
    let casoUso

    beforeEach(() => {
        commandAdaptadorMock = {
            iniciar: jest.fn(),
            registrarRespuestasYCalcularPuntaje: jest.fn()
        }
        casoUso = new IntentoQuizCommandUsesCase(commandAdaptadorMock)
    })

    test('iniciarIntento: debe crear el intento con las preguntas seleccionadas', async() => {
        commandAdaptadorMock.iniciar.mockResolvedValue({
            estado: 'ok',
            id: 1,
            id_inscripcion: 3,
            id_quiz: 2,
            preguntas_seleccionadas: [1, 2, 3, 4, 5]
        })

        const dto = {
            getIdInscripcion: () => 3,
            getIdQuiz: () => 2,
            getIdsPreguntas: () => [1, 2, 3, 4, 5]
        }
        const resultado = await casoUso.iniciarIntento(dto)

        expect(resultado.estado).toBe('ok')
        expect(commandAdaptadorMock.iniciar).toHaveBeenCalledTimes(1)
        const intentoArgumento = commandAdaptadorMock.iniciar.mock.calls[0][0]
        expect(intentoArgumento.getPreguntasSeleccionadas()).toEqual([1, 2, 3, 4, 5])
    })

    test('registrarRespuestas: debe calcular el puntaje correctamente', async() => {
        commandAdaptadorMock.registrarRespuestasYCalcularPuntaje.mockResolvedValue({
            estado: 'ok',
            id: 1,
            puntaje: 80,
            correctas: 4,
            total: 5
        })

        const dto = {
            getId: () => 1,
            getRespuestas: () => [
                { id_pregunta: 1, id_opcion_seleccionada: 2, es_correcta: true },
                { id_pregunta: 2, id_opcion_seleccionada: 5, es_correcta: true },
                { id_pregunta: 3, id_opcion_seleccionada: 7, es_correcta: false },
                { id_pregunta: 4, id_opcion_seleccionada: 10, es_correcta: true },
                { id_pregunta: 5, id_opcion_seleccionada: 13, es_correcta: true }
            ]
        }
        const resultado = await casoUso.registrarRespuestas(dto)

        expect(resultado.estado).toBe('ok')
        expect(resultado.puntaje).toBe(80)
        expect(resultado.correctas).toBe(4)
    })
})