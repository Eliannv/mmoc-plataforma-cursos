import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import OpenApiValidator from 'express-openapi-validator'

import { traceMiddleWare } from './infraestructura/middleware/TraceMiddleware.js'
import { loggerMiddleware } from './infraestructura/middleware/LoggerMiddleware.js'
import inscripcionRutas from './infraestructura/rutas/moduloInscripcionRutas.js'
import progresoRutas from './infraestructura/rutas/moduloProgresoRutas.js'
import intentoQuizRutas from './infraestructura/rutas/moduloIntentoQuizRutas.js'
import sequelize from './infraestructura/base-dato/Postgresql.js'
import './infraestructura/modelos/ModeloInscripcion.js'
import './infraestructura/modelos/ModeloProgresoContenido.js'
import './infraestructura/modelos/ModeloIntentoQuiz.js'
import './infraestructura/modelos/ModeloRespuestaIntento.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: { code: '400 INVALID_JSON', message: 'JSON inválido: ' + err.message, details: [] }, meta: { traceId: req.traceId || 'N/A', timestamp: new Date().toISOString(), path: req.path } })
    }
    next(err)
})

const urlContrato = './src/infraestructura/contrato-api/api-v1.yaml'
const swaggerDocument = YAML.load(urlContrato)
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(traceMiddleWare)
app.use(loggerMiddleware)

app.use('/api/v1', OpenApiValidator.middleware({ apiSpec: urlContrato, validateRequests: true, validateResponses: false }))

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({ mensaje: err.message, errores: err.errors })
})

app.use('/api/v1/inscripciones', inscripcionRutas)
app.use('/api/v1/progreso', progresoRutas)
app.use('/api/v1/intentos', intentoQuizRutas)

const PORT = process.env.PORT || 3003

sequelize.sync({ force: false })
    .then(() => {
        console.log('✓ Tablas sincronizadas con la base de datos')
        app.listen(PORT, () => console.log(`✓ progreso-servicio corriendo en puerto ${PORT}`))
    })
    .catch((error) => {
        console.error('✗ Error al sincronizar la base de datos:', error)
        process.exit(1)
    })