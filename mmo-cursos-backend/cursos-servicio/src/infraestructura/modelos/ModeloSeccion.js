import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloSeccion = sequelize.define('seccion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_curso: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'seccion', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloSeccion
export { sequelize }