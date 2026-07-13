import jwt from 'jsonwebtoken'

export const jwtMiddleware = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization']
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: { code: '401 NO_AUTORIZADO', message: 'Token de acceso requerido', details: [] }, meta: { traceId: req.traceId || 'N/A', timestamp: new Date().toISOString(), path: req.path } })
        }
        const token = authHeader.split(' ')[1]
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET || 'mmo_jwt_secret')
            req.usuario = payload
            if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(payload.rol)) {
                return res.status(403).json({ error: { code: '403 ACCESO_DENEGADO', message: 'No tiene permisos para esta operación', details: [] }, meta: { traceId: req.traceId || 'N/A', timestamp: new Date().toISOString(), path: req.path } })
            }
            next()
        } catch (error) {
            return res.status(401).json({ error: { code: '401 TOKEN_INVALIDO', message: 'Token inválido o expirado', details: [error.message] }, meta: { traceId: req.traceId || 'N/A', timestamp: new Date().toISOString(), path: req.path } })
        }
    }
}