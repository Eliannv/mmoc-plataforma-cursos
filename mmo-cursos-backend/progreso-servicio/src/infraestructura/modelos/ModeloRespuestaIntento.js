import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloRespuestaIntento = sequelize.define('respuesta_intento', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_intento: { type: DataTypes.INTEGER, allowNull: false },
    id_pregunta: { type: DataTypes.INTEGER, allowNull: false },
    id_opcion_seleccionada: { type: DataTypes.INTEGER, allowNull: false },
    es_correcta: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
    tableName: 'respuesta_intento',
    timestamps: false,
    schema: 'public',
    freezeTableName: true,
    paranoid: true
})

export default ModeloRespuestaIntento
export { sequelize }