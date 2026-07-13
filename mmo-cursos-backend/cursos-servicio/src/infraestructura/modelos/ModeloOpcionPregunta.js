import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloOpcionPregunta = sequelize.define('opcion_pregunta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_pregunta: { type: DataTypes.INTEGER, allowNull: false },
    texto: { type: DataTypes.STRING(500), allowNull: false },
    es_correcta: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'opcion_pregunta', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloOpcionPregunta
export { sequelize }