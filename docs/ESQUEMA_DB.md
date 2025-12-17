# Esquema de Base de Datos - Gestión de Expedientes CFE

## Resumen

Este documento describe la estructura completa del esquema de datos para el sistema de gestión de expedientes de colaboradores de CFE. El esquema está diseñado para trabajar con JSON Server como API mock, pero está pensado para migrar fácilmente a una base de datos relacional real.

## Estructura de Colecciones

### 1. `users` (Usuarios del Sistema)
Ya existente. Usuarios que pueden acceder al sistema (Admin/Operador).

### 2. `collaborators` (Colaboradores)
Representa a los empleados de CFE con sus datos personales y laborales.

**Campos principales:**
- `id`: Identificador único
- `nombre`, `apellidos`: Nombre completo
- `rpe`: Registro de Personal de Empleados (obligatorio)
- `rtt`: Registro de Trabajadores Temporales (opcional)
- `areaId`, `adscripcionId`, `puestoId`: Relaciones con catálogos
- `tipoContrato`: Tipo de contrato (base, confianza, eventual, honorarios, otro)
- `rfc`, `curp`, `imss`: Datos fiscales y de seguridad social
- `isActive`: Baja lógica
- `createdAt`, `updatedAt`, `createdBy`: Auditoría

### 3. `documents` (Documentos del Expediente)
**Estructura unificada** para todos los tipos de documentos del expediente.

**Campos principales:**
- `id`: Identificador único
- `collaboratorId`: Relación con colaborador
- `kind`: Tipo de documento (`bateria`, `historial`, `perfil`, `constancia`, `otro`)
- `periodo`: Período asociado (opcional, para historiales y constancias)
- `descripcion`: Descripción del documento
- `fileName`, `fileUrl`: Información del archivo
- `fileSize`, `fileType`: Metadatos del archivo
- `uploadedBy`, `uploadedAt`: Auditoría de carga
- `isActive`: Baja lógica

**Ventajas de la estructura unificada:**
- Consultas más simples (un solo endpoint para todos los documentos)
- Fácil filtrado y agrupación
- Escalable para agregar nuevos tipos
- Menos complejidad en el código

### 4. `areas` (Catálogo de Áreas)
Áreas organizacionales de CFE (Generación, Transmisión, Distribución, etc.)

### 5. `adscripciones` (Catálogo de Adscripciones)
Adscripciones específicas dentro de cada área. Relacionadas con `areas` mediante `areaId`.

### 6. `puestos` (Catálogo de Puestos)
Puestos de trabajo disponibles en CFE.

### 7. `documentTypes` (Catálogo de Tipos de Documento)
Tipos específicos para clasificar documentos del tipo "otro" (ej: Identificación Oficial, Comprobante de Domicilio).

### 8. `logs` (Logs de Auditoría)
Registro de acciones importantes en el sistema.

**Campos:**
- `id`: Identificador único
- `userId`: Usuario que realizó la acción
- `action`: Tipo de acción (`create`, `update`, `delete`, `download`, `upload`, `view`)
- `entity`: Entidad afectada (`collaborator`, `document`, `area`, etc.)
- `entityId`: ID de la entidad afectada
- `metadata`: Información adicional (JSON)
- `createdAt`: Timestamp

## Relaciones

```
users (1) ──┐
            │
            ├──> collaborators (N) ──> documents (N)
            │
            └──> logs (N)

areas (1) ──> adscripciones (N)
collaborators (N) ──> areas (1)
collaborators (N) ──> adscripciones (1)
collaborators (N) ──> puestos (1)
documents (N) ──> collaborators (1)
```

## Tipos de Documento (kind)

1. **`bateria`**: Batería de capacitación (uno por colaborador)
2. **`historial`**: Historial de capacitación / Kárdex (múltiples por período)
3. **`perfil`**: Perfil de puesto (uno por colaborador)
4. **`constancia`**: Constancias de capacitación (múltiples)
5. **`otro`**: Otros documentos clasificados por `documentTypes`

## Estado del Expediente

El estado se calcula dinámicamente basado en los documentos:

- **`completo`**: Tiene batería, historial y perfil
- **`incompleto`**: Tiene algunos documentos pero no todos los requeridos
- **`sin_documentos`**: No tiene ningún documento

La función `calculateExpedienteStatus()` en `entities/collaborator/model/helpers.ts` calcula este estado.

## Endpoints JSON Server

### Colaboradores
- `GET /collaborators` - Listar (con filtros opcionales)
- `GET /collaborators/:id` - Obtener por ID
- `POST /collaborators` - Crear
- `PUT /collaborators/:id` - Actualizar
- `DELETE /collaborators/:id` - Eliminar (baja lógica)
- `POST /collaborators/:id/toggle-status` - Alternar estado

### Documentos
- `GET /documents` - Listar todos
- `GET /collaborators/:id/documents` - Documentos de un colaborador
- `GET /documents/:id` - Obtener por ID
- `POST /documents` - Crear/subir
- `PUT /documents/:id` - Actualizar metadatos
- `DELETE /documents/:id` - Eliminar (baja lógica)

### Catálogos
- CRUD estándar para `/areas`, `/adscripciones`, `/puestos`, `/documentTypes`
- `GET /areas/:id/adscripciones` - Adscripciones por área
- `GET /documentTypes?kind=otro` - Tipos por kind

### Reportes
- `GET /reports/summary` - Resumen de expedientes (custom endpoint)

### Logs
- `GET /logs` - Listar logs
- `POST /logs` - Crear log
- `GET /logs?entity=collaborator&entityId=1` - Logs por entidad

## Notas de Implementación

1. **Baja Lógica**: Tanto `collaborators` como `documents` usan `isActive` para baja lógica en lugar de eliminación física.

2. **Filtros**: Los filtros en `GET /collaborators` se implementarán como query params en el middleware de `server.cjs`.

3. **Archivos**: En el mock, `fileUrl` es una ruta simulada. En producción, esto apuntaría a un servicio de almacenamiento real (S3, Azure Blob, etc.).

4. **Validaciones**: Las validaciones de negocio (ej: RPE único, RFC válido) se implementarán en el middleware de `server.cjs`.

## Migración a Base de Datos Real

Cuando se migre a una DB relacional:

1. **Tablas principales**: `users`, `collaborators`, `documents`, `logs`
2. **Tablas de catálogo**: `areas`, `adscripciones`, `puestos`, `document_types`
3. **Índices**: 
   - `collaborators.rpe` (único)
   - `collaborators.areaId`, `collaborators.adscripcionId`
   - `documents.collaboratorId`, `documents.kind`
4. **Foreign Keys**: Todas las relaciones deben tener FK
5. **Constraints**: 
   - RPE único
   - RFC formato válido
   - CURP formato válido

## Ejemplos de Datos

Ver `db.json` para ejemplos completos de cada colección con datos realistas de CFE.
