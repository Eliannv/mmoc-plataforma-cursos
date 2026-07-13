import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloPregunta = sequelize.define('pregunta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_quiz: { type: DataTypes.INTEGER, allowNull: false },
    enunciado: { type: DataTypes.TEXT, allowNull: false },
    orden: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'pregunta', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloPregunta
export { sequelize }