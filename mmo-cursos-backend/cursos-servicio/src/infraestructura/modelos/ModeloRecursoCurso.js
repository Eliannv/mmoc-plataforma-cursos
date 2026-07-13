import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloRecursoCurso = sequelize.define('recurso_curso', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_curso: { type: DataTypes.INTEGER, allowNull: false },
    nombre: { type: DataTypes.STRING(200), allowNull: false },
    tipo: { type: DataTypes.ENUM('DOCUMENTO', 'ENLACE'), allowNull: false },
    url_recurso: { type: DataTypes.STRING(500), allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'recurso_curso', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloRecursoCurso
export { sequelize }