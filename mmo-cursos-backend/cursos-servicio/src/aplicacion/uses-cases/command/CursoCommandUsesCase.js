import Curso from '../../../dominio/entidades/Curso.js'

export default class CursoCommandUsesCase {
    constructor(adaptadorBDSalida) {
        this.adaptadorBDSalida = adaptadorBDSalida
    }

    async crear(dtoCurso, idInstructor) {
        const curso = new Curso(
            null,
            dtoCurso.getTitulo(),
            dtoCurso.getDescripcion(),
            dtoCurso.getNivel(),
            'BORRADOR',
            dtoCurso.getIdCategoria(),
            idInstructor,
            0
        )
        const resultado = await this.adaptadorBDSalida.guardar(curso)
        console.log('Curso creado en caso de uso')
        return resultado
    }

    async editar(dtoCurso, datosProvistos = {}) {
        if (!dtoCurso.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para actualizar' }
        }
        const curso = new Curso(
            dtoCurso.getId(), dtoCurso.getTitulo(), dtoCurso.getDescripcion(),
            dtoCurso.getNivel(), dtoCurso.getEstado(), dtoCurso.getIdCategoria(),
            dtoCurso.getIdInstructor(), dtoCurso.getDuracionTotalMinutos()
        )
        const resultado = await this.adaptadorBDSalida.editar(curso, datosProvistos)
        console.log('Curso actualizado en caso de uso')
        return resultado
    }

    async eliminar(dtoCurso) {
        if (!dtoCurso.getId()) {
            return { estado: 'error', resultado: 'El ID es requerido para eliminar' }
        }
        return await this.adaptadorBDSalida.eliminar(dtoCurso)
    }

    async publicar(id) {
        return await this.adaptadorBDSalida.cambiarEstado(id, 'PUBLICADO')
    }

    async despublicar(id) {
        return await this.adaptadorBDSalida.cambiarEstado(id, 'BORRADOR')
    }
}