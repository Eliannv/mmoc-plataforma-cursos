import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

import { traceMiddleWare } from './infraestructura/middleware/TraceMiddleware.js'
import { loggerMiddleware } from './infraestructura/middleware/LoggerMiddleware.js'
import bffRutas from './infraestructura/rutas/BffRutas.js'

const app = express()
app.use(cors())
app.use(express.json())

const urlContrato = './src/infraestructura/contrato-api/api-v1.yaml'
const swaggerDocument = YAML.load(urlContrato)
app.use('/api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(traceMiddleWare)
app.use(loggerMiddleware)

app.use('/api/v1', bffRutas)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`✓ bff-servicio corriendo en puerto ${PORT}`)
})