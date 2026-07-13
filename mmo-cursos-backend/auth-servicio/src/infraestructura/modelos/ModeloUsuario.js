import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloUsuario = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },
    contrasena: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'INSTRUCTOR', 'ESTUDIANTE'),
        defaultValue: 'ESTUDIANTE',
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('ACTIVO', 'INACTIVO'),
        defaultValue: 'ACTIVO',
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    }
}, {
    tableName: 'usuario',
    timestamps: false,
    schema: 'public',
    freezeTableName: true,
    paranoid: true
})

export default ModeloUsuario
export { sequelize }