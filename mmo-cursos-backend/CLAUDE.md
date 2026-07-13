# MMO Cursos Backend — Directrices de Desarrollo

Basado en Karpathy-Inspired Claude Code Guidelines.

## Los Cuatro Principios

### 1. Piensa Antes de Codificar
- Expresa suposiciones explícitamente. Si hay ambigüedad, pregunta.
- Presenta múltiples interpretaciones cuando existan.
- Detente cuando haya confusión — nombra qué no está claro.

### 2. Simplicity First
- Código mínimo que resuelve el problema. Nada especulativo.
- Sin features más allá de lo pedido.
- Sin abstracciones para código de un solo uso.
- Sin manejo de errores para escenarios imposibles.

### 3. Cambios Quirúrgicos
- Toca solo lo que debes. No "mejores" código adyacente.
- Mantén el estilo existente, aunque lo harías distinto.
- Si notas código muerto no relacionado, menciónalo — no lo borres.

### 4. Ejecución Orientada a Metas
- Define criterios de éxito verificables.
- Para tareas de múltiples pasos, enuncia el plan antes de ejecutar.

## Convenciones de Este Proyecto

- **Lenguaje**: JavaScript ESM (`"type": "module"`)
- **ORM**: Sequelize + pg
- **Nombres**: Todo en español (entidades, métodos, errores, rutas)
- **Respuesta éxito**: `{ data, message, meta: { traceId, timestamp, path }, links }`
- **Respuesta error**: `{ error: { code, message, details }, meta: { traceId, timestamp, path } }`
- **Soft delete**: `deletedAt` + `paranoid: true` en TODAS las entidades
- **Transacciones**: `READ_COMMITTED` en todos los command adapters
- **Testing**: Jest con ESM (`--experimental-vm-modules`)
- **Roles**: `ADMIN`, `INSTRUCTOR`, `ESTUDIANTE`
