import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

// Tipos de actividad v1
//   escenario_decision  — config: { situacion, opciones: [{texto, retroalimentacion}] }
//   verdadero_falso     — config: { enunciado, es_verdadero, explicacion }
//   reflexion_abierta   — config: { pregunta, guia_respuesta }
const ModeloActividadInteractiva = sequelize.define('actividad_interactiva', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_item: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    tipo: {
        type: DataTypes.ENUM('escenario_decision', 'verdadero_falso', 'reflexion_abierta'),
        allowNull: true
    },
    config: { type: DataTypes.JSONB, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'actividad_interactiva', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloActividadInteractiva
export { sequelize }