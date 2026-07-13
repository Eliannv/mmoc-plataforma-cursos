import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloCategoria = sequelize.define('categoria', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    estado: { type: DataTypes.ENUM('ACTIVO', 'INACTIVO'), defaultValue: 'ACTIVO', allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'categoria', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloCategoria
export { sequelize }