import ModeloCurso from './ModeloCurso.js'
import ModeloSeccion from './ModeloSeccion.js'
import ModeloItemContenido from './ModeloItemContenido.js'

ModeloCurso.hasMany(ModeloSeccion, { foreignKey: 'id_curso', as: 'secciones' })
ModeloSeccion.belongsTo(ModeloCurso, { foreignKey: 'id_curso' })

ModeloSeccion.hasMany(ModeloItemContenido, { foreignKey: 'id_seccion', as: 'items' })
ModeloItemContenido.belongsTo(ModeloSeccion, { foreignKey: 'id_seccion' })
