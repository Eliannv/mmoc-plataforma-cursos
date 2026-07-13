import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloCurso = sequelize.define('curso', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    nivel: { type: DataTypes.ENUM('BASICO', 'INTERMEDIO'), allowNull: false },
    estado: { type: DataTypes.ENUM('BORRADOR', 'PUBLICADO', 'INACTIVO'), defaultValue: 'BORRADOR', allowNull: false },
    id_categoria: { type: DataTypes.INTEGER, allowNull: false },
    id_instructor: { type: DataTypes.INTEGER, allowNull: false },
    duracion_total_minutos: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'curso', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloCurso
export { sequelize }