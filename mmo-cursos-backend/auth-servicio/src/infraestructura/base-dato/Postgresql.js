import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
    process.env.DB_NAME || 'auth_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'admin', {
        host: process.env.DB_HOST || 'auth-db',
        port: parseInt(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        logging: console.log
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('✓ Conexión ORM a la base de datos establecida exitosamente.')
    })
    .catch((error) => {
        console.error('✗ No se pudo conectar a la base de datos:', error)
    })

export default sequelize