import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloItemContenido = sequelize.define('item_contenido', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_seccion: { type: DataTypes.INTEGER, allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    tipo: { type: DataTypes.ENUM('VIDEO', 'DOCUMENTO', 'ACTIVIDAD_INTERACTIVA', 'QUIZ'), allowNull: false },
    orden: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'item_contenido', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloItemContenido
export { sequelize }