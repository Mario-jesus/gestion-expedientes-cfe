# Endpoints de API - Gestión de Expedientes CFE

## Resumen

Este documento describe todos los endpoints personalizados implementados en `server.cjs` para el sistema de gestión de expedientes. Los endpoints CRUD estándar de JSON Server también están disponibles para todas las colecciones.

## Autenticación

### POST /auth/login
Inicia sesión de un usuario.

**Body:**
```json
{
  "username": "admin",
  "password": "cualquiera"
}
```

**Response:**
```json
{
  "token": "mock-jwt-token-1-1234567890",
  "user": {
    "id": "1",
    "username": "admin",
    "name": "Administrador Principal",
    "email": "admin@cfe.com",
    "role": "admin",
    "isActive": true
  }
}
```

### POST /auth/logout
Cierra sesión (simulado).

### GET /auth/me
Obtiene el usuario actual basado en el token.

**Headers:**
```
Authorization: Bearer mock-jwt-token-1-1234567890
```

### POST /auth/refresh
Refresca el token de autenticación.

---

## Colaboradores

### GET /collaborators
Lista colaboradores con filtros avanzados.

**Query Parameters:**
- `q` (string): Búsqueda por nombre, apellidos o RPE
- `areaId` (string): Filtrar por área
- `adscripcionId` (string): Filtrar por adscripción
- `puestoId` (string): Filtrar por puesto
- `tipoContrato` (string): Filtrar por tipo de contrato (`base`, `confianza`, `eventual`, `honorarios`, `otro`)
- `isActive` (boolean): Filtrar por estado activo (`true`/`false`)
- `estadoExpediente` (string): Filtrar por estado del expediente (`completo`, `incompleto`, `sin_documentos`)

**Ejemplo:**
```
GET /collaborators?q=Juan&areaId=1&estadoExpediente=completo
```

**Response:**
```json
[
  {
    "id": "1",
    "nombre": "Juan Carlos",
    "apellidos": "Pérez García",
    "rpe": "RPE001234",
    "areaId": "1",
    "adscripcionId": "1",
    "puestoId": "1",
    "tipoContrato": "base",
    "rfc": "PEGJ850101ABC",
    "curp": "PEGJ850101HDFRRN01",
    "imss": "12345678901",
    "isActive": true,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
]
```

### GET /collaborators/:id
Obtiene un colaborador por ID (CRUD estándar de JSON Server).

### POST /collaborators
Crea un nuevo colaborador con validaciones.

**Body:**
```json
{
  "nombre": "Juan",
  "apellidos": "Pérez",
  "rpe": "RPE001234",
  "rtt": null,
  "areaId": "1",
  "adscripcionId": "1",
  "puestoId": "1",
  "tipoContrato": "base",
  "rfc": "PEGJ850101ABC",
  "curp": "PEGJ850101HDFRRN01",
  "imss": "12345678901",
  "isActive": true
}
```

**Validaciones:**
- RPE, RFC, CURP e IMSS son requeridos
- RPE debe ser único
- Se crea log de auditoría automáticamente

### PUT /collaborators/:id
Actualiza un colaborador (CRUD estándar de JSON Server).

### DELETE /collaborators/:id
Elimina un colaborador (baja lógica, CRUD estándar de JSON Server).

### POST /collaborators/:id/toggle-status
Alterna el estado activo/inactivo del colaborador.

**Response:**
```json
{
  "id": "1",
  "nombre": "Juan Carlos",
  "isActive": false,
  ...
}
```

### GET /collaborators/:id/documents
Obtiene todos los documentos de un colaborador específico.

**Response:**
```json
[
  {
    "id": "1",
    "collaboratorId": "1",
    "kind": "bateria",
    "fileName": "bateria_capacitacion_RPE001234.pdf",
    "fileUrl": "/uploads/documents/bateria_capacitacion_RPE001234.pdf",
    "uploadedAt": "2024-01-15T12:00:00.000Z",
    ...
  }
]
```

---

## Documentos

### GET /documents
Lista todos los documentos (CRUD estándar de JSON Server).

### GET /documents/:id
Obtiene un documento por ID (CRUD estándar de JSON Server).

### POST /documents
Crea/sube un nuevo documento con validaciones y auditoría.

**Body:**
```json
{
  "collaboratorId": "1",
  "kind": "bateria",
  "periodo": null,
  "descripcion": "Batería de capacitación inicial",
  "fileName": "bateria_capacitacion_RPE001234.pdf",
  "fileUrl": "/uploads/documents/bateria_capacitacion_RPE001234.pdf",
  "fileSize": 256000,
  "fileType": "application/pdf"
}
```

**Validaciones:**
- `collaboratorId`, `kind` y `fileName` son requeridos
- El colaborador debe existir
- `kind` debe ser uno de: `bateria`, `historial`, `perfil`, `constancia`, `otro`
- Se crea log de auditoría automáticamente

### PUT /documents/:id
Actualiza metadatos de un documento (CRUD estándar de JSON Server).

### DELETE /documents/:id
Elimina un documento (baja lógica, CRUD estándar de JSON Server).

---

## Catálogos

### Áreas

#### GET /areas
Lista todas las áreas (CRUD estándar de JSON Server).

#### GET /areas/:id
Obtiene un área por ID (CRUD estándar de JSON Server).

#### GET /areas/:id/adscripciones
Obtiene todas las adscripciones de un área específica.

**Response:**
```json
[
  {
    "id": "1",
    "nombre": "Central Hidroeléctrica Manuel Moreno Torres",
    "areaId": "1",
    "isActive": true,
    ...
  }
]
```

### Adscripciones

#### GET /adscripciones
Lista todas las adscripciones (CRUD estándar de JSON Server).

### Puestos

#### GET /puestos
Lista todos los puestos (CRUD estándar de JSON Server).

### Tipos de Documento

#### GET /documentTypes
Lista tipos de documento, opcionalmente filtrados por `kind`.

**Query Parameters:**
- `kind` (string): Filtrar por tipo (`bateria`, `historial`, `perfil`, `constancia`, `otro`)

**Ejemplo:**
```
GET /documentTypes?kind=otro
```

---

## Reportes

### GET /reports/summary
Obtiene resumen estadístico de expedientes.

**Query Parameters:**
- `areaId` (string, opcional): Filtrar por área específica

**Response:**
```json
{
  "totalColaboradores": 5,
  "completos": 2,
  "incompletos": 2,
  "sinDocumentos": 1,
  "porArea": {
    "1": {
      "total": 2,
      "completos": 1,
      "incompletos": 1,
      "areaNombre": "Generación"
    },
    "2": {
      "total": 2,
      "completos": 1,
      "incompletos": 1,
      "areaNombre": "Transmisión"
    }
  }
}
```

---

## Usuarios

### GET /users
Lista todos los usuarios (CRUD estándar de JSON Server).

### POST /users/:id/toggle-status
Alterna el estado activo/inactivo del usuario.

### POST /users/:id/change-password
Cambia la contraseña del usuario (simulado).

---

## Logs de Auditoría

### GET /logs
Lista todos los logs (CRUD estándar de JSON Server).

### GET /logs?entity=collaborator&entityId=1
Filtra logs por entidad e ID (usando query params de JSON Server).

### POST /logs
Crea un log (normalmente se crea automáticamente, pero está disponible).

---

## Notas de Implementación

1. **Baja Lógica**: Los endpoints DELETE no eliminan físicamente, solo marcan `isActive: false`.

2. **Auditoría Automática**: Los endpoints POST de colaboradores y documentos crean logs automáticamente si hay un usuario autenticado.

3. **Validaciones**: 
   - RPE único para colaboradores
   - Validación de existencia de colaborador al crear documentos
   - Validación de tipos de documento permitidos

4. **Filtros Combinables**: Los filtros en `GET /collaborators` se pueden combinar. Por ejemplo:
   ```
   GET /collaborators?areaId=1&estadoExpediente=completo&isActive=true
   ```

5. **Estado del Expediente**: Se calcula dinámicamente basado en los documentos:
   - **completo**: Tiene batería, historial y perfil
   - **incompleto**: Tiene algunos documentos pero no todos los requeridos
   - **sin_documentos**: No tiene ningún documento

6. **Tokens Mock**: Los tokens tienen formato `mock-jwt-token-{userId}-{timestamp}`. En producción, se usarían JWT reales.

---

## Endpoints CRUD Estándar

JSON Server proporciona automáticamente endpoints CRUD para todas las colecciones:

- `GET /{resource}` - Listar
- `GET /{resource}/:id` - Obtener por ID
- `POST /{resource}` - Crear
- `PUT /{resource}/:id` - Actualizar completo
- `PATCH /{resource}/:id` - Actualizar parcial
- `DELETE /{resource}/:id` - Eliminar

Recursos disponibles: `users`, `collaborators`, `documents`, `areas`, `adscripciones`, `puestos`, `documentTypes`, `logs`.
