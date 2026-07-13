import CategoriaCommandUsesCase from '../src/aplicacion/uses-cases/command/CategoriaCommandUsesCase.js'

describe('CategoriaCommandUsesCase', () => {
    let adaptadorMock
    let casoUso

    beforeEach(() => {
        adaptadorMock = {
            guardar: jest.fn(),
            editar: jest.fn(),
            eliminar: jest.fn()
        }
        casoUso = new CategoriaCommandUsesCase(adaptadorMock)
    })

    test('crear: debe crear una categoría correctamente', async() => {
        adaptadorMock.guardar.mockResolvedValue({ estado: 'ok', id: 1, nombre: 'Violencia', descripcion: '', estado: 'ACTIVO' })
        const dto = { getNombre: () => 'Violencia', getDescripcion: () => '', getEstado: () => 'ACTIVO' }
        const resultado = await casoUso.crear(dto)
        expect(resultado.estado).toBe('ok')
        expect(resultado.nombre).toBe('Violencia')
        expect(adaptadorMock.guardar).toHaveBeenCalledTimes(1)
    })

    test('editar: debe rechazar si no hay ID', async() => {
        const dto = { getId: () => null, getNombre: () => 'Acoso', getDescripcion: () => '', getEstado: () => 'ACTIVO' }
        const resultado = await casoUso.editar(dto, {})
        expect(resultado.estado).toBe('error')
        expect(adaptadorMock.editar).not.toHaveBeenCalled()
    })

    test('editar: debe editar correctamente cuando hay ID', async() => {
        adaptadorMock.editar.mockResolvedValue({ estado: 'ok', id: 1, nombre: 'Acoso Actualizado' })
        const dto = { getId: () => 1, getNombre: () => 'Acoso Actualizado', getDescripcion: () => '', getEstado: () => 'ACTIVO' }
        const resultado = await casoUso.editar(dto, { nombre: 'Acoso Actualizado' })
        expect(resultado.estado).toBe('ok')
        expect(adaptadorMock.editar).toHaveBeenCalledTimes(1)
    })

    test('eliminar: debe rechazar si no hay ID', async() => {
        const dto = { getId: () => null }
        const resultado = await casoUso.eliminar(dto)
        expect(resultado.estado).toBe('error')
        expect(adaptadorMock.eliminar).not.toHaveBeenCalled()
    })
})