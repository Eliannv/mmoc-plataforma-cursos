import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloDocumento = sequelize.define('documento', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_item: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    // storage_key es la ruta del objeto en MinIO (ej: 'docs/42/guia.pdf'). Null hasta confirmación.
    storage_key: { type: DataTypes.STRING(500), allowNull: true },
    nombre_archivo: { type: DataTypes.STRING(200), allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'documento', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloDocumento
export { sequelize }