import AuthQueryUsesCase from '../src/aplicacion/uses-cases/query/AuthQueryUsesCase.js'
import bcrypt from 'bcrypt'

describe('AuthQueryUsesCase - login', () => {
    let adaptadorMock
    let casoUso

    beforeEach(() => {
        adaptadorMock = {
            obtenerPorCorreo: jest.fn(),
            obtenerPorId: jest.fn()
        }
        casoUso = new AuthQueryUsesCase(adaptadorMock)
        process.env.JWT_SECRET = 'test_secret'
        process.env.JWT_EXPIRES_IN = '1h'
    })

    test('debe retornar token cuando las credenciales son válidas', async() => {
        const hashReal = await bcrypt.hash('clave1234', 10)
        adaptadorMock.obtenerPorCorreo.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, nombre: 'Ana', correo: 'ana@mmo.org', contrasena: hashReal, rol: 'ESTUDIANTE', estado: 'ACTIVO' }
        })

        const dtoMock = {
            getCorreo: () => 'ana@mmo.org',
            getContrasena: () => 'clave1234'
        }

        const resultado = await casoUso.login(dtoMock)

        expect(resultado.estado).toBe('ok')
        expect(resultado.token).toBeDefined()
        expect(resultado.usuario.correo).toBe('ana@mmo.org')
    })

    test('debe rechazar login cuando el correo no existe', async() => {
        adaptadorMock.obtenerPorCorreo.mockResolvedValue({ estado: 'error', resultado: null })

        const dtoMock = {
            getCorreo: () => 'noexiste@mmo.org',
            getContrasena: () => 'clave1234'
        }

        const resultado = await casoUso.login(dtoMock)

        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('Credenciales inválidas')
    })

    test('debe rechazar login cuando la contraseña es incorrecta', async() => {
        const hashReal = await bcrypt.hash('clave1234', 10)
        adaptadorMock.obtenerPorCorreo.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, nombre: 'Ana', correo: 'ana@mmo.org', contrasena: hashReal, rol: 'ESTUDIANTE', estado: 'ACTIVO' }
        })

        const dtoMock = {
            getCorreo: () => 'ana@mmo.org',
            getContrasena: () => 'contrasenaMal'
        }

        const resultado = await casoUso.login(dtoMock)

        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('Credenciales inválidas')
    })

    test('debe rechazar login si el usuario está inactivo', async() => {
        const hashReal = await bcrypt.hash('clave1234', 10)
        adaptadorMock.obtenerPorCorreo.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, nombre: 'Ana', correo: 'ana@mmo.org', contrasena: hashReal, rol: 'ESTUDIANTE', estado: 'INACTIVO' }
        })

        const dtoMock = {
            getCorreo: () => 'ana@mmo.org',
            getContrasena: () => 'clave1234'
        }

        const resultado = await casoUso.login(dtoMock)

        expect(resultado.estado).toBe('error')
        expect(resultado.resultado).toContain('inactiva')
    })
})

describe('AuthQueryUsesCase - obtenerPerfil', () => {
    let adaptadorMock
    let casoUso

    beforeEach(() => {
        adaptadorMock = { obtenerPorId: jest.fn() }
        casoUso = new AuthQueryUsesCase(adaptadorMock)
    })

    test('debe retornar el perfil cuando el usuario existe', async() => {
        adaptadorMock.obtenerPorId.mockResolvedValue({
            estado: 'ok',
            resultado: { id: 1, nombre: 'Ana', correo: 'ana@mmo.org', rol: 'ESTUDIANTE', estado: 'ACTIVO' }
        })

        const resultado = await casoUso.obtenerPerfil(1)

        expect(resultado.estado).toBe('ok')
        expect(resultado.resultado.nombre).toBe('Ana')
    })

    test('debe retornar error cuando el usuario no existe', async() => {
        adaptadorMock.obtenerPorId.mockResolvedValue({ estado: 'error', resultado: null })

        const resultado = await casoUso.obtenerPerfil(999)

        expect(resultado.estado).toBe('error')
    })
})