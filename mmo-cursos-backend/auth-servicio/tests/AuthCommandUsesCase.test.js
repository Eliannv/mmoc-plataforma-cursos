import AuthCommandUsesCase from '../src/aplicacion/uses-cases/command/AuthCommandUsesCase.js'

describe('AuthCommandUsesCase - registrar', () => {
    let adaptadorMock
    let casoUso

    beforeEach(() => {
        adaptadorMock = {
            guardar: jest.fn(),
            verificarCorreoExiste: jest.fn()
        }
        casoUso = new AuthCommandUsesCase(adaptadorMock)
    })

    test('debe registrar un usuario correctamente cuando el correo no existe', async() => {
        adaptadorMock.verificarCorreoExiste.mockResolvedValue(false)
        adaptadorMock.guardar.mockResolvedValue({
            estado: 'ok',
            id: 1,
            nombre: 'Ana García',
            correo: 'ana@mmo.org',
            rol: 'ESTUDIANTE'
        })

        const dtoMock = {
            getNombre: () => 'Ana García',
            getCorreo: () => 'ana@mmo.org',
            getContrasena: () => 'clave1234',
            getRol: () => 'ESTUDIANTE',
            getEstado: () => 'ACTIVO'
        }

        const resultado = await casoUso.registrar(dtoMock)

        expect(resultado.estado).toBe('ok')
        expect(resultado.id).toBe(1)
        expect(adaptadorMock.verificarCorreoExiste).toHaveBeenCalledWith('ana@mmo.org')
        expect(adaptadorMock.guardar).toHaveBeenCalledTimes(1)
    })

    test('debe rechazar el registro si el correo ya existe', async() => {
        adaptadorMock.verificarCorreoExiste.mockResolvedValue(true)

        const dtoMock = {
            getNombre: () => 'Ana García',
            getCorreo: () => 'ana@mmo.org',
            getContrasena: () => 'clave1234',
            getRol: () => 'ESTUDIANTE',
            getEstado: () => 'ACTIVO'
        }

        const resultado = await casoUso.registrar(dtoMock)

        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('correo ya está registrado')
        expect(adaptadorMock.guardar).not.toHaveBeenCalled()
    })

    test('debe hashear la contraseña antes de guardar', async() => {
        adaptadorMock.verificarCorreoExiste.mockResolvedValue(false)
        adaptadorMock.guardar.mockResolvedValue({
            estado: 'ok',
            id: 2,
            nombre: 'María',
            correo: 'maria@mmo.org',
            rol: 'INSTRUCTOR'
        })

        const contrasenaCruda = 'miclave123'
        const dtoMock = {
            getNombre: () => 'María',
            getCorreo: () => 'maria@mmo.org',
            getContrasena: () => contrasenaCruda,
            getRol: () => 'INSTRUCTOR',
            getEstado: () => 'ACTIVO'
        }

        await casoUso.registrar(dtoMock)

        const usuarioGuardado = adaptadorMock.guardar.mock.calls[0][0]
        expect(usuarioGuardado.getContrasena()).not.toBe(contrasenaCruda)
        expect(usuarioGuardado.getContrasena()).toMatch(/^\$2[aby]\$/)
    })
})