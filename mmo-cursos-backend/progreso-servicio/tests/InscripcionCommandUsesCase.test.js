import InscripcionCommandUsesCase from '../src/aplicacion/uses-cases/command/InscripcionCommandUsesCase.js'

describe('InscripcionCommandUsesCase - inscribirse', () => {
    let commandAdaptadorMock
    let queryAdaptadorMock
    let casoUso

    beforeEach(() => {
        commandAdaptadorMock = { guardar: jest.fn() }
        queryAdaptadorMock = { obtenerPorUsuarioYCurso: jest.fn() }
        casoUso = new InscripcionCommandUsesCase(commandAdaptadorMock, queryAdaptadorMock)
    })

    test('debe inscribirse correctamente cuando el estudiante no está inscrito', async() => {
        queryAdaptadorMock.obtenerPorUsuarioYCurso.mockResolvedValue({ estado: 'error', resultado: null })
        commandAdaptadorMock.guardar.mockResolvedValue({ estado: 'ok', id: 1, id_usuario: 5, id_curso: 2 })

        const dto = { getIdCurso: () => 2 }
        const resultado = await casoUso.inscribirse(dto, 5)

        expect(resultado.estado).toBe('ok')
        expect(commandAdaptadorMock.guardar).toHaveBeenCalledTimes(1)
    })

    test('debe rechazar si el estudiante ya está inscrito', async() => {
        queryAdaptadorMock.obtenerPorUsuarioYCurso.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, id_usuario: 5, id_curso: 2 }
        })

        const dto = { getIdCurso: () => 2 }
        const resultado = await casoUso.inscribirse(dto, 5)

        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('ya está inscrito')
        expect(commandAdaptadorMock.guardar).not.toHaveBeenCalled()
    })
})