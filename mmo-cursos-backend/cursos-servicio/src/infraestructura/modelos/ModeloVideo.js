import { DataTypes } from 'sequelize'
import sequelize from '../base-dato/Postgresql.js'

const ModeloVideo = sequelize.define('video', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    id_item: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    // key del objeto en MinIO/S3 (ej: "videos/42/original.mp4"). Null hasta que el instructor sube el archivo.
    storage_key: { type: DataTypes.STRING(500), allowNull: true },
    // Duración en segundos, validada por ffprobe tras la subida. Null hasta confirmar.
    duracion_segundos: { type: DataTypes.INTEGER, allowNull: true },
    // Estado del procesamiento del video
    //   PENDIENTE   — item creado, video aún no subido
    //   LISTO       — subido y validado (duracion 180-240s)
    //   FALLIDO     — subido pero fuera de rango de duración permitida
    //   PROCESANDO  — hook reservado para transcodificación HLS (Opción A — TODO futura entrega)
    estado_procesamiento: {
        type: DataTypes.ENUM('PENDIENTE', 'LISTO', 'FALLIDO', 'PROCESANDO'),
        defaultValue: 'PENDIENTE',
        allowNull: false
    },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, { tableName: 'video', timestamps: false, schema: 'public', freezeTableName: true, paranoid: true })

export default ModeloVideo
export { sequelize }