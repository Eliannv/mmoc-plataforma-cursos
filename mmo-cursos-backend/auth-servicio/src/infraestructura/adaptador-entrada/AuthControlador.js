import { UsuarioDTO } from '../../aplicacion/dto/UsuarioDTO.js'
import AuthEntradaPuerto from '../../aplicacion/puertos/entrada/AuthEntradaPuerto.js'

export class AuthControlador extends AuthEntradaPuerto {
    constructor(casoUsoCommand, casoUsoQuery) {
        super()
        this.casoUsoCommand = casoUsoCommand
        this.casoUsoQuery = casoUsoQuery
    }

    respuestaExitosa(res, cuerpo, descripcion, codigoHttp = 200, ruta = '/api/v1/auth') {
        return res.status(codigoHttp).json({
            data: cuerpo,
            message: descripcion,
            meta: {
                traceId: res.req.traceId || 'N/A',
                timestamp: new Date().toISOString(),
                path: ruta
            },
            links: { self: ruta }
        })
    }

    respuestaError(res, codigoHttp, tipoError, descripcion, detalles = [], ruta = '/api/v1/auth') {
        return res.status(codigoHttp).json({
            error: {
                code: `${codigoHttp} ${tipoError}`,
                message: descripcion,
                details: detalles
            },
            meta: {
                traceId: res.req.traceId || 'N/A',
                timestamp: new Date().toISOString(),
                path: ruta
            }
        })
    }

    // POST /api/v1/auth/registro
    registrar = async(req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return this.respuestaError(res, 400, 'CUERPO_VACIO', 'Debe proporcionar los datos del nuevo usuario', [], req.path)
            }

            const dto = new UsuarioDTO(req.body)
            try {
                dto.validarRegistro()
            } catch (error) {
                const detalles = error.message.startsWith('[') ? JSON.parse(error.message) : [error.message]
                return this.respuestaError(res, 400, 'DATOS_INVALIDOS', 'Los datos enviados no son válidos', detalles, req.path)
            }

            const resultado = await this.casoUsoCommand.registrar(dto)
            if (resultado.estado === 'error') {
                return this.respuestaError(res, 400, 'FALLO_REGISTRO', 'No fue posible registrar el usuario', [resultado.resultado], req.path)
            }

            return this.respuestaExitosa(res, {
                id: resultado.id,
                nombre: resultado.nombre,
                correo: resultado.correo,
                rol: resultado.rol
            }, 'Usuario registrado exitosamente', 201, `/api/v1/auth/registro`)

        } catch (error) {
            console.error('Error en registrar:', error)
            return this.respuestaError(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico en el servidor', [error.message], req.path)
        }
    }

    // POST /api/v1/auth/login
    login = async(req, res) => {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                return this.respuestaError(res, 400, 'CUERPO_VACIO', 'Debe proporcionar correo y contraseña', [], req.path)
            }

            const dto = new UsuarioDTO(req.body)
            try {
                dto.validarLogin()
            } catch (error) {
                const detalles = error.message.startsWith('[') ? JSON.parse(error.message) : [error.message]
                return this.respuestaError(res, 400, 'DATOS_INVALIDOS', 'Los datos enviados no son válidos', detalles, req.path)
            }

            const resultado = await this.casoUsoQuery.login(dto)
            if (resultado.estado === 'error') {
                return this.respuestaError(res, 401, 'CREDENCIALES_INVALIDAS', resultado.resultado, [], req.path)
            }

            return this.respuestaExitosa(res, {
                token: resultado.token,
                usuario: resultado.usuario
            }, 'Autenticación exitosa', 200, req.path)

        } catch (error) {
            console.error('Error en login:', error)
            return this.respuestaError(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico en el servidor', [error.message], req.path)
        }
    }

    // GET /api/v1/auth/perfil  (requiere JWT)
    obtenerPerfil = async(req, res) => {
        try {
            const id = req.usuario.id
            if (!id) {
                return this.respuestaError(res, 401, 'NO_AUTORIZADO', 'Token de acceso requerido', [], req.path)
            }

            const resultado = await this.casoUsoQuery.obtenerPerfil(id)
            if (resultado.estado === 'error') {
                return this.respuestaError(res, 404, 'RECURSO_NO_ENCONTRADO', 'Usuario no encontrado', [], req.path)
            }

            return this.respuestaExitosa(res, resultado.resultado, 'Perfil obtenido exitosamente', 200, req.path)

        } catch (error) {
            console.error('Error en obtenerPerfil:', error)
            return this.respuestaError(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico en el servidor', [error.message], req.path)
        }
    }

    // GET /api/v1/usuarios  (admin)
    listarUsuarios = async(req, res) => {
        try {
            const { pagina = 1, limite = 20, rol } = req.query
            const resultado = await this.casoUsoQuery.listarUsuarios({ pagina, limite, rol })
            if (resultado.estado === 'error') {
                return this.respuestaError(res, 500, 'ERROR_LISTADO', 'No fue posible listar los usuarios', [resultado.resultado], req.path)
            }
            return this.respuestaExitosa(res, resultado.resultado, 'Usuarios obtenidos exitosamente', 200, req.path)
        } catch (error) {
            return this.respuestaError(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico en el servidor', [error.message], req.path)
        }
    }

    // PATCH /api/v1/usuarios/:id/rol  (admin)
    cambiarRol = async(req, res) => {
        try {
            const { id } = req.params
            const { rol } = req.body
            if (!id || isNaN(parseInt(id))) {
                return this.respuestaError(res, 400, 'ID_INVALIDO', 'El ID del usuario debe ser un número', [], req.path)
            }
            const rolesValidos = ['ADMIN', 'INSTRUCTOR', 'ESTUDIANTE']
            if (!rol || !rolesValidos.includes(rol)) {
                return this.respuestaError(res, 400, 'ROL_INVALIDO', 'El rol debe ser ADMIN, INSTRUCTOR o ESTUDIANTE', [], req.path)
            }
            const resultado = await this.casoUsoCommand.cambiarRol(parseInt(id), rol)
            if (resultado.estado === 'error') {
                return this.respuestaError(res, 404, 'RECURSO_NO_ENCONTRADO', resultado.resultado, [], req.path)
            }
            return this.respuestaExitosa(res, resultado, 'Rol actualizado exitosamente', 200, req.path)
        } catch (error) {
            return this.respuestaError(res, 500, 'ERROR_SERVIDOR', 'Fallo crítico en el servidor', [error.message], req.path)
        }
    }
}