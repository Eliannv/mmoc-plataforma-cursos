import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloQuiz = sequelize.define('quiz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_item: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    instrucciones: { type: DataTypes.TEXT, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'quiz', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloQuiz
export { sequelize }