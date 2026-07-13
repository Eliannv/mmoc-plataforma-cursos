import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloProgresoContenido = sequelize.define('progreso_contenido', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_inscripcion: { type: DataTypes.INTEGER, allowNull: false },
    id_item_contenido: { type: DataTypes.INTEGER, allowNull: false },
    completado: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    segundos_vistos: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    fecha_completado: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
    tableName: 'progreso_contenido',
    timestamps: false,
    schema: 'public',
    freezeTableName: true,
    paranoid: true
})

export default ModeloProgresoContenido
export { sequelize }