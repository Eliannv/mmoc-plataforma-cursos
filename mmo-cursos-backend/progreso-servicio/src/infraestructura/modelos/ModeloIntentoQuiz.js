import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloIntentoQuiz = sequelize.define('intento_quiz', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_inscripcion: { type: DataTypes.INTEGER, allowNull: false },
    id_quiz: { type: DataTypes.INTEGER, allowNull: false },
    preguntas_seleccionadas: { type: DataTypes.JSONB, allowNull: false },
    puntaje: { type: DataTypes.INTEGER, allowNull: true },
    completado: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    fecha_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_fin: { type: DataTypes.DATE, allowNull: true },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
    tableName: 'intento_quiz',
    timestamps: false,
    schema: 'public',
    freezeTableName: true,
    paranoid: true
})

export default ModeloIntentoQuiz
export { sequelize }