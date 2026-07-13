// Seed script — idempotente (requiere BFF + cursos-servicio en ejecución)
// node scripts/seed.js

const BFF = 'http://localhost:3000/api/v1'
const CURSOS_API = 'http://localhost:3002/api/v1'
const LOGIN = { correo: 'admin@mmo.com', contrasena: 'Admin123!' }

async function api(base, method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${base}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const json = await res.json()
  return { ok: res.ok, status: res.status, ...json }
}

const CATEGORIAS = [
  { nombre: 'Violencia de Género', descripcion: 'Conceptos, tipos y prevención de la violencia de género' },
  { nombre: 'Acoso', descripcion: 'Identificación, recursos y rutas legales ante el acoso' },
  { nombre: 'Acompañamiento Legal', descripcion: 'Procesos jurídicos, derechos y asesoría legal' },
  { nombre: 'Apoyo Psicológico', descripcion: 'Contención emocional, salud mental y autocuidado' },
  { nombre: 'Derechos Humanos', descripcion: 'Marco legal, tratados internacionales y mecanismos de protección' },
]

const CURSO1 = {
  titulo: 'Detección y prevención del acoso',
  descripcion: 'Aprende a identificar las distintas formas de acoso, reconocer las señales de alerta y conocer las rutas de acción para prevenir y actuar ante situaciones de acoso en espacios públicos, laborales y digitales.',
  nivel: 'BASICO', id_categoria: 'Acoso', id_instructor: 1,
  secciones: [
    { titulo: 'Conceptos fundamentales', items: [
      { titulo: '¿Qué es el acoso y cómo identificarlo?', tipo: 'VIDEO' },
      { titulo: 'Glosario de términos legales', tipo: 'DOCUMENTO' },
    ]},
    { titulo: 'Situaciones cotidianas', items: [
      { titulo: 'El acoso en espacios públicos', tipo: 'VIDEO' },
      { titulo: 'Reflexión: ¿has presenciado una situación de acoso?', tipo: 'ACTIVIDAD_INTERACTIVA' },
    ]},
    { titulo: 'Cómo reconocer las señales', items: [
      { titulo: 'Guía rápida de señales de alerta', tipo: 'DOCUMENTO' },
      { titulo: 'Testimonios y señales de alerta', tipo: 'VIDEO' },
    ]},
    { titulo: 'Cómo actuar', items: [
      { titulo: 'Ruta de acción ante el acoso', tipo: 'VIDEO' },
      { titulo: 'Directorio de recursos y líneas de ayuda', tipo: 'DOCUMENTO' },
      { titulo: 'Evaluación del curso', tipo: 'QUIZ' },
    ]},
  ],
}

const CURSO2 = {
  titulo: 'Acompañamiento legal para víctimas de violencia',
  descripcion: 'Conoce el marco jurídico que protege a las víctimas de violencia, aprende el proceso de denuncia paso a paso y descubre las herramientas legales disponibles para brindar acompañamiento efectivo.',
  nivel: 'INTERMEDIO', id_categoria: 'Acompañamiento Legal', id_instructor: 3,
  secciones: [
    { titulo: 'Marco jurídico básico', items: [
      { titulo: 'Derechos que protegen a las víctimas', tipo: 'VIDEO' },
      { titulo: 'Leyes y tratados internacionales', tipo: 'DOCUMENTO' },
    ]},
    { titulo: 'Procesos legales', items: [
      { titulo: 'Denuncia: paso a paso', tipo: 'VIDEO' },
      { titulo: 'Formatos de denuncia', tipo: 'DOCUMENTO' },
      { titulo: 'Escenario de decisión: ¿cuándo denunciar?', tipo: 'ACTIVIDAD_INTERACTIVA' },
    ]},
  ],
}

const CURSO3 = {
  titulo: 'Salud mental y autocuidado',
  descripcion: 'Herramientas prácticas para el cuidado de la salud mental, manejo del estrés y técnicas de autocuidado emocional.',
  nivel: 'BASICO', id_categoria: 'Apoyo Psicológico', id_instructor: 1, estado: 'BORRADOR',
  secciones: [
    { titulo: 'Introducción', items: [
      { titulo: '¿Por qué es importante el autocuidado?', tipo: 'VIDEO' },
    ]},
    { titulo: 'Herramientas prácticas', items: [
      { titulo: 'Ejercicios de respiración', tipo: 'DOCUMENTO' },
      { titulo: 'Meditación guiada', tipo: 'VIDEO' },
    ]},
  ],
}

const PREGUNTAS_QUIZ = [
  { enunciado: '¿Cuál de las siguientes es una forma de acoso?', opciones: [
    { texto: 'Hacer preguntas en una reunión de trabajo', es_correcta: false },
    { texto: 'Enviar mensajes ofensivos o amenazantes de forma reiterada', es_correcta: true },
    { texto: 'Pedir indicaciones en la calle', es_correcta: false },
    { texto: 'Saludar cordialmente a un compañero', es_correcta: false },
  ]},
  { enunciado: 'El acoso callejero incluye conductas como:', opciones: [
    { texto: 'Comentarios verbales no deseados, silbidos y miradas intimidantes', es_correcta: true },
    { texto: 'Un desconocido que te pregunta la hora', es_correcta: false },
    { texto: 'Un vendedor ambulante ofreciendo sus productos', es_correcta: false },
    { texto: 'Un peatón que camina detrás de ti sin intención', es_correcta: false },
  ]},
  { enunciado: '¿Qué es el acoso laboral?', opciones: [
    { texto: 'Recibir retroalimentación sobre tu desempeño', es_correcta: false },
    { texto: 'Conductas hostiles y repetitivas contra un trabajador que atentan contra su dignidad', es_correcta: true },
    { texto: 'Trabajar horas extra de forma voluntaria', es_correcta: false },
    { texto: 'Participar en una junta de equipo', es_correcta: false },
  ]},
  { enunciado: 'Una señal de alerta de acoso escolar (bullying) es:', opciones: [
    { texto: 'El niño comparte sus tareas con compañeros', es_correcta: false },
    { texto: 'El niño muestra cambios repentinos de humor, se aísla o tiene moretones sin explicación', es_correcta: true },
    { texto: 'El niño juega durante el recreo', es_correcta: false },
    { texto: 'El niño pide ayuda con la tarea', es_correcta: false },
  ]},
  { enunciado: 'El ciberacoso se caracteriza por:', opciones: [
    { texto: 'Compartir contenido útil en redes sociales', es_correcta: false },
    { texto: 'Hostigamiento, difusión de información privada o amenazas a través de medios digitales', es_correcta: true },
    { texto: 'Enviar mensajes cordiales por correo electrónico', es_correcta: false },
    { texto: 'Publicar fotos de vacaciones en redes sociales', es_correcta: false },
  ]},
  { enunciado: '¿Cuál es el primer paso recomendado ante una situación de acoso?', opciones: [
    { texto: 'Ignorar la situación para que desaparezca', es_correcta: false },
    { texto: 'Buscar un espacio seguro y documentar lo ocurrido', es_correcta: true },
    { texto: 'Confrontar físicamente al agresor', es_correcta: false },
    { texto: 'Publicarlo en redes sociales de inmediato', es_correcta: false },
  ]},
  { enunciado: '¿Qué ley en México tipifica la violencia contra las mujeres?', opciones: [
    { texto: 'Ley Federal del Trabajo', es_correcta: false },
    { texto: 'Ley General de Acceso de las Mujeres a una Vida Libre de Violencia', es_correcta: true },
    { texto: 'Ley de Propiedad Intelectual', es_correcta: false },
    { texto: 'Código Civil Federal', es_correcta: false },
  ]},
  { enunciado: '¿Dónde puedes denunciar un caso de violencia de género en México?', opciones: [
    { texto: 'En la farmacia más cercana', es_correcta: false },
    { texto: 'En el Ministerio Público o la Fiscalía de la Mujer', es_correcta: true },
    { texto: 'En una tienda departamental', es_correcta: false },
    { texto: 'En la escuela local', es_correcta: false },
  ]},
  { enunciado: '¿Cuál de las siguientes conductas NO es acoso sexual?', opciones: [
    { texto: 'Hacer comentarios obscenos sobre el cuerpo de una persona', es_correcta: false },
    { texto: 'Solicitar favores sexuales a cambio de beneficios', es_correcta: false },
    { texto: 'Realizar una entrevista de trabajo con preguntas profesionales', es_correcta: true },
    { texto: 'Tocar el cuerpo de una persona sin su consentimiento', es_correcta: false },
  ]},
  { enunciado: '¿Qué es el "victim blaming"?', opciones: [
    { texto: 'Apoyar a la víctima de un delito', es_correcta: false },
    { texto: 'Culpar a la víctima por la agresión sufrida', es_correcta: true },
    { texto: 'Denunciar un delito ante las autoridades', es_correcta: false },
    { texto: 'Acompañar legalmente a una víctima', es_correcta: false },
  ]},
  { enunciado: 'El acoso psicológico puede incluir:', opciones: [
    { texto: 'Manipulación, aislamiento y descalificación constante', es_correcta: true },
    { texto: 'Recibir un aumento de sueldo', es_correcta: false },
    { texto: 'Participar en actividades recreativas', es_correcta: false },
    { texto: 'Recibir retroalimentación constructiva', es_correcta: false },
  ]},
  { enunciado: '¿Qué hacer si alguien está siendo acosado frente a ti?', opciones: [
    { texto: 'Grabar y compartir el video sin permiso', es_correcta: false },
    { texto: 'Intervenir de forma segura, preguntar si necesita ayuda y llamar a las autoridades si es necesario', es_correcta: true },
    { texto: 'Ignorar la situación porque no es tu problema', es_correcta: false },
    { texto: 'Unirte al acosador para no ser víctima', es_correcta: false },
  ]},
  { enunciado: '¿Cuál es un recurso de ayuda en México para víctimas de violencia?', opciones: [
    { texto: 'El chat de la escuela', es_correcta: false },
    { texto: 'La Línea de Ayuda 911 o el 089 para denuncia anónima', es_correcta: true },
    { texto: 'El servicio de mensajería de WhatsApp', es_correcta: false },
    { texto: 'La página de Facebook del municipio', es_correcta: false },
  ]},
  { enunciado: 'El acoso en el transporte público es considerado:', opciones: [
    { texto: 'Una falta administrativa que puede ser sancionada', es_correcta: true },
    { texto: 'Un comportamiento normal y aceptable', es_correcta: false },
    { texto: 'Un cumplido inofensivo', es_correcta: false },
    { texto: 'Un problema menor que no merece atención', es_correcta: false },
  ]},
  { enunciado: '¿Cuánto tiempo tengo para denunciar una agresión?', opciones: [
    { texto: 'Solo el mismo día de la agresión', es_correcta: false },
    { texto: 'No hay un plazo único; depende del tipo de delito y la jurisdicción', es_correcta: true },
    { texto: 'Máximo una semana', es_correcta: false },
    { texto: 'Máximo un mes', es_correcta: false },
  ]},
  { enunciado: '¿Qué incluye una orden de protección?', opciones: [
    { texto: 'Prohibición de acercarse a la víctima y comunicación con ella', es_correcta: true },
    { texto: 'Una compensación económica automática', es_correcta: false },
    { texto: 'La cárcel inmediata para el agresor', es_correcta: false },
    { texto: 'Un juicio público en redes sociales', es_correcta: false },
  ]},
  { enunciado: '¿Cuál es un mito común sobre el acoso?', opciones: [
    { texto: 'El acoso solo ocurre en lugares oscuros y solitarios', es_correcta: true },
    { texto: 'El acoso puede ocurrir en cualquier lugar', es_correcta: false },
    { texto: 'Las víctimas de acoso pueden sufrir consecuencias psicológicas', es_correcta: false },
    { texto: 'El acoso es un delito', es_correcta: false },
  ]},
  { enunciado: '¿Qué documento es importante conservar en caso de acoso laboral?', opciones: [
    { texto: 'Correos electrónicos, mensajes y cualquier registro de las conductas hostiles', es_correcta: true },
    { texto: 'Solo las fotografías del agresor', es_correcta: false },
    { texto: 'El contrato de trabajo original nada más', es_correcta: false },
    { texto: 'Ningún documento, es mejor olvidar lo ocurrido', es_correcta: false },
  ]},
  { enunciado: 'El acompañamiento legal a víctimas de acoso incluye:', opciones: [
    { texto: 'Asesoría jurídica, representación legal y orientación sobre el proceso de denuncia', es_correcta: true },
    { texto: 'Solo dar consejos informales', es_correcta: false },
    { texto: 'Pagar la fianza del agresor', es_correcta: false },
    { texto: 'Mediar entre la víctima y el agresor para llegar a un acuerdo', es_correcta: false },
  ]},
  { enunciado: '¿Cuál es el objetivo principal de la prevención del acoso?', opciones: [
    { texto: 'Crear entornos seguros y respetuosos donde se reconozcan y detengan las conductas de acoso', es_correcta: true },
    { texto: 'Evitar que las personas hablen sobre el acoso', es_correcta: false },
    { texto: 'Enseñar a las víctimas a defenderse físicamente', es_correcta: false },
    { texto: 'Reducir las penas para los acosadores', es_correcta: false },
  ]},
]

async function esperar(ms) { return new Promise(r => setTimeout(r, ms)) }

async function obtenerToken() {
  console.log('▶ Iniciando sesión como admin...')
  const r = await api(BFF, 'POST', '/auth/login', LOGIN, null)
  if (!r.ok) throw new Error(`Login falló: ${JSON.stringify(r)}`)
  const token = r.data?.token
  if (!token) throw new Error('No se recibió token')
  console.log('  ✓ Token obtenido')
  return token
}

async function crearCategorias(token) {
  console.log('\n▶ Categorías...')
  const existentes = await api(BFF, 'GET', '/categorias')
  const nombres = new Set((existentes.data || []).map(c => c.nombre))
  for (const cat of CATEGORIAS) {
    if (nombres.has(cat.nombre)) { console.log(`  - Ya existe: "${cat.nombre}"`); continue }
    const r = await api(BFF, 'POST', '/categorias', cat, token)
    if (r.ok) console.log(`  ✓ "${cat.nombre}"`)
    else console.error(`  ✗ "${cat.nombre}": ${r.error?.message || r.message}`)
    await esperar(50)
  }
  const final = await api(BFF, 'GET', '/categorias')
  const map = {}; (final.data || []).forEach(c => { map[c.nombre] = c.id })
  console.log(`  → ${Object.keys(map).length} categorías: ${Object.keys(map).join(', ')}`)
  return map
}

async function crearCurso(cursoDef, token, categoriasMap) {
  const idCat = categoriasMap[cursoDef.id_categoria]
  if (!idCat) throw new Error(`Categoría "${cursoDef.id_categoria}" no encontrada`)
  const estado = cursoDef.estado || 'PUBLICADO'

  const existentes = await api(BFF, 'GET', '/cursos', null, token)
  if ((existentes.data || []).find(c => c.titulo === cursoDef.titulo)) {
    console.log(`  - Ya existe: "${cursoDef.titulo}"`)
    return
  }

  console.log(`  Creando: "${cursoDef.titulo}"...`)
  const cr = await api(BFF, 'POST', '/cursos', { titulo: cursoDef.titulo, descripcion: cursoDef.descripcion, nivel: cursoDef.nivel, id_categoria: idCat }, token)
  if (!cr.ok) throw new Error(`Error creando curso: ${JSON.stringify(cr)}`)
  const cursoId = cr.data?.id
  console.log(`    ✓ Curso ID ${cursoId}`)

  if (estado === 'PUBLICADO') {
    const pr = await api(BFF, 'PUT', `/cursos/${cursoId}/publicar`, null, token)
    if (pr.ok) console.log(`    ✓ Publicado`)
    else console.error(`    ✗ Error al publicar: ${pr.error?.message}`)
  }

  let quizItemId = null
  for (let si = 0; si < cursoDef.secciones.length; si++) {
    const secDef = cursoDef.secciones[si]
    const sr = await api(BFF, 'POST', `/cursos/${cursoId}/secciones`, { titulo: secDef.titulo, orden: si + 1 }, token)
    if (!sr.ok) throw new Error(`Error creando sección: ${JSON.stringify(sr)}`)
    const secId = sr.data?.id

    for (let ii = 0; ii < secDef.items.length; ii++) {
      const itemDef = secDef.items[ii]
      const ir = await api(BFF, 'POST', `/secciones/${secId}/items`, { titulo: itemDef.titulo, tipo: itemDef.tipo, orden: ii + 1 }, token)
      if (!ir.ok) throw new Error(`Error creando item "${itemDef.titulo}": ${JSON.stringify(ir)}`)
      if (itemDef.tipo === 'QUIZ') quizItemId = ir.data?.id
      await esperar(30)
    }
  }

  if (quizItemId) {
    console.log(`    Resolviendo quiz para item ${quizItemId}...`)
    const qr = await api(CURSOS_API, 'GET', `/quizzes/item/${quizItemId}`, null, token)
    if (!qr.ok) { console.error(`    ✗ Quiz no encontrado para item ${quizItemId}: ${JSON.stringify(qr)}`); return }
    const quizId = qr.data?.id
    if (!quizId) { console.error(`    ✗ Respuesta sin id: ${JSON.stringify(qr)}`); return }
    console.log(`    ✓ Quiz ID ${quizId}, agregando ${PREGUNTAS_QUIZ.length} preguntas...`)
    for (let i = 0; i < PREGUNTAS_QUIZ.length; i++) {
      const p = PREGUNTAS_QUIZ[i]
      const rr = await api(CURSOS_API, 'POST', `/quizzes/${quizId}/preguntas`, { enunciado: p.enunciado, opciones: p.opciones, orden: i + 1 }, token)
      if (!rr.ok) console.error(`      ✗ Error pregunta ${i + 1}: ${rr.error?.message || JSON.stringify(rr)}`)
      if ((i + 1) % 5 === 0) console.log(`      ${i + 1}/${PREGUNTAS_QUIZ.length}`)
      await esperar(20)
    }
    console.log(`    ✓ ${PREGUNTAS_QUIZ.length} preguntas agregadas`)
  }
}

async function main() {
  console.log('=== SEED MMO EL ORO ===\n')
  const token = await obtenerToken()
  const categoriasMap = await crearCategorias(token)

  console.log('\n▶ Curso 1 (PUBLICADO): Detección y prevención del acoso')
  await crearCurso(CURSO1, token, categoriasMap)

  console.log('\n▶ Curso 2 (PUBLICADO): Acompañamiento legal')
  await crearCurso(CURSO2, token, categoriasMap)

  console.log('\n▶ Curso 3 (BORRADOR): Salud mental')
  await crearCurso(CURSO3, token, categoriasMap)

  console.log('\n▶ Verificación...')
  const cats = await api(BFF, 'GET', '/categorias')
  console.log(`  Categorías: ${(cats.data || []).length}`)

  const pubs = await api(BFF, 'GET', '/cursos/publicos')
  console.log(`  Cursos públicos: ${(pubs.data || []).length}`)
  ;(pubs.data || []).forEach(c => console.log(`    [${c.id}] "${c.titulo}" (${c.estado})`))

  const all = await api(BFF, 'GET', '/cursos', null, token)
  console.log(`  Cursos totales: ${(all.data || []).length}`)
  ;(all.data || []).forEach(c => console.log(`    [${c.id}] "${c.titulo}" (${c.estado})`))

  const borrador = (all.data || []).find(c => c.estado === 'BORRADOR')
  const enPublicos = borrador && (pubs.data || []).some(c => c.id === borrador.id)
  if (enPublicos) console.log('⚠ ERROR: Borrador aparece en listado público')
  else if (borrador) console.log(`✓ Borrador "${borrador.titulo}" NO aparece en listado público`)

  console.log('\n=== SEED COMPLETADO ===')
}

main().catch(err => { console.error('\n✗ Error fatal:', err); process.exit(1) })
