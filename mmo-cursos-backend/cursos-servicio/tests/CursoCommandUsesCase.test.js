import CursoCommandUsesCase from '../src/aplicacion/uses-cases/command/CursoCommandUsesCase.js'

describe('CursoCommandUsesCase', () => {
    let adaptadorMock
    let casoUso

    beforeEach(() => {
        adaptadorMock = {
            guardar: jest.fn(),
            editar: jest.fn(),
            eliminar: jest.fn(),
            cambiarEstado: jest.fn()
        }
        casoUso = new CursoCommandUsesCase(adaptadorMock)
    })

    test('crear: debe crear un curso en estado BORRADOR', async() => {
        adaptadorMock.guardar.mockResolvedValue({ estado: 'ok', id: 1, titulo: 'Liderazgo Femenino', estado: 'BORRADOR' })
        const dto = {
            getTitulo: () => 'Liderazgo Femenino',
            getDescripcion: () => 'Curso de liderazgo',
            getNivel: () => 'BASICO',
            getEstado: () => 'BORRADOR',
            getIdCategoria: () => 3,
            getIdInstructor: () => 5,
            getDuracionTotalMinutos: () => 0
        }
        const resultado = await casoUso.crear(dto, 5)
        expect(resultado.estado).toBe('ok')
        expect(resultado.estado).toBe('ok')
        const cursoArgumento = adaptadorMock.guardar.mock.calls[0][0]
        expect(cursoArgumento.getEstado()).toBe('BORRADOR')
    })

    test('publicar: debe cambiar estado a PUBLICADO', async() => {
        adaptadorMock.cambiarEstado.mockResolvedValue({ estado: 'ok', id: 1, estado: 'PUBLICADO' })
        const resultado = await casoUso.publicar(1)
        expect(adaptadorMock.cambiarEstado).toHaveBeenCalledWith(1, 'PUBLICADO')
    })

    test('despublicar: debe cambiar estado a BORRADOR', async() => {
        adaptadorMock.cambiarEstado.mockResolvedValue({ estado: 'ok', id: 1, estado: 'BORRADOR' })
        await casoUso.despublicar(1)
        expect(adaptadorMock.cambiarEstado).toHaveBeenCalledWith(1, 'BORRADOR')
    })
})