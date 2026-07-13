import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloInscripcion = sequelize.define('inscripcion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: false },
    id_curso: { type: DataTypes.INTEGER, allowNull: false },
    fecha_inscripcion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('ACTIVO', 'COMPLETADO', 'INACTIVO'), defaultValue: 'ACTIVO', allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
    tableName: 'inscripcion',
    timestamps: false,
    schema: 'public',
    freezeTableName: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ['id_usuario', 'id_curso'], where: { deletedAt: null } }]
})

export default ModeloInscripcion
export { sequelize }