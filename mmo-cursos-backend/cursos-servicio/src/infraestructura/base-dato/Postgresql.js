import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
    process.env.DB_NAME || 'cursos_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'admin', {
        host: process.env.DB_HOST || 'cursos-db',
        port: parseInt(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: console.log
    }
)

sequelize.authenticate()
    .then(() => console.log('✓ Conexión ORM a cursos_db establecida.'))
    .catch((error) => console.error('✗ No se pudo conectar a cursos_db:', error))

export default sequelize