import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import OpenApiValidator from 'express-openapi-validator'

import { traceMiddleWare } from './infraestructura/middleware/TraceMiddleware.js'
import { loggerMiddleware } from './infraestructura/middleware/LoggerMiddleware.js'
import categoriaRutas from './infraestructura/rutas/moduloCategoriaRutas.js'
import cursoRutas from './infraestructura/rutas/moduloCursoRutas.js'
import seccionRutas from './infraestructura/rutas/moduloSeccionRutas.js'
import itemContenidoRutas from './infraestructura/rutas/moduloItemContenidoRutas.js'
import quizRutas from './infraestructura/rutas/moduloQuizRutas.js'
import videoRutas from './infraestructura/rutas/moduloVideoRutas.js'
import documentoRutas from './infraestructura/rutas/moduloDocumentoRutas.js'
import actividadRutas from './infraestructura/rutas/moduloActividadRutas.js'
import sequelize from './infraestructura/base-dato/Postgresql.js'
import './infraestructura/modelos/ModeloCategoria.js'
import './infraestructura/modelos/ModeloCurso.js'
import './infraestructura/modelos/ModeloRecursoCurso.js'
import './infraestructura/modelos/ModeloSeccion.js'
import './infraestructura/modelos/ModeloItemContenido.js'
import './infraestructura/modelos/ModeloVideo.js'
import './infraestructura/modelos/ModeloDocumento.js'
import './infraestructura/modelos/ModeloActividadInteractiva.js'
import './infraestructura/modelos/ModeloQuiz.js'
import './infraestructura/modelos/ModeloPregunta.js'
import './infraestructura/modelos/ModeloOpcionPregunta.js'
import './infraestructura/modelos/Asociaciones.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: { code: '400 INVALID_JSON', message: 'JSON inválido: ' + err.message, details: [] },
            meta: { traceId: req.traceId || 'N/A', timestamp: new Date().toISOString(), path: req.path }
        })
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

app.use('/api/v1/categorias', categoriaRutas)
app.use('/api/v1/cursos', cursoRutas)
app.use('/api/v1/secciones', seccionRutas)
app.use('/api/v1/items', itemContenidoRutas)
app.use('/api/v1/quizzes', quizRutas)
app.use('/api/v1/videos', videoRutas)
app.use('/api/v1/documentos', documentoRutas)
app.use('/api/v1/actividades', actividadRutas)

const PORT = process.env.PORT || 3002

sequelize.sync({ alter: true })
    .then(() => {
        console.log('✓ Tablas sincronizadas con la base de datos')
        app.listen(PORT, () => {
            console.log(`✓ cursos-servicio corriendo en puerto ${PORT}`)
        })
    })
    .catch((error) => {
        console.error('✗ Error al sincronizar la base de datos:', error)
        process.exit(1)
    })