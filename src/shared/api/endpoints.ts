/**
 * Definición centralizada de endpoints del API backend
 * Todos los endpoints incluyen el prefijo /api
 */
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh',
  },

  // Usuarios
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    GET: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
    CHANGE_PASSWORD: (id: string) => `/api/users/${id}/change-password`,
    // Endpoints adicionales de la API real
    ME: '/api/users/me',
    ME_ACTIVITY: '/api/users/me/activity',
    ACTIVATE: (id: string) => `/api/users/${id}/activate`,
    DEACTIVATE: (id: string) => `/api/users/${id}/deactivate`,
  },

  // Expedientes/Colaboradores (mantener por compatibilidad si se usa)
  EMPLOYEES: {
    LIST: '/api/employees',
    CREATE: '/api/employees',
    GET: (id: string) => `/api/employees/${id}`,
    UPDATE: (id: string) => `/api/employees/${id}`,
    DELETE: (id: string) => `/api/employees/${id}`,
    SEARCH: '/api/employees/search',
  },

  // Minutas
  MINUTES: {
    LIST: '/api/minutes',
    CREATE: '/api/minutes',
    GET: (id: string) => `/api/minutes/${id}`,
    UPDATE: (id: string) => `/api/minutes/${id}`,
    DELETE: (id: string) => `/api/minutes/${id}`,
    DOWNLOAD: (id: string) => `/api/minutes/${id}/download`,
  },

  // Colaboradores
  COLLABORATORS: {
    LIST: '/api/collaborators',
    CREATE: '/api/collaborators',
    GET: (id: string) => `/api/collaborators/${id}`,
    UPDATE: (id: string) => `/api/collaborators/${id}`,
    DELETE: (id: string) => `/api/collaborators/${id}`,
    SEARCH: '/api/collaborators/search',
    // Endpoints adicionales de la API real
    ACTIVATE: (id: string) => `/api/collaborators/${id}/activate`,
    DEACTIVATE: (id: string) => `/api/collaborators/${id}/deactivate`,
    DOCUMENTS: (id: string) => `/api/collaborators/${id}/documents`,
  },

  // Documentos de colaboradores
  DOCUMENTS: {
    LIST: '/api/documents',
    CREATE: '/api/documents',
    GET: (id: string) => `/api/documents/${id}`,
    UPDATE: (id: string) => `/api/documents/${id}`,
    DELETE: (id: string) => `/api/documents/${id}`,
    BY_COLLABORATOR: (collaboratorId: string) => `/api/collaborators/${collaboratorId}/documents`,
    DOWNLOAD: (id: string) => `/api/documents/${id}/download`,
  },

  // Catálogos - Actualizados a /api/catalogs/*
  AREAS: {
    LIST: '/api/catalogs/areas',
    CREATE: '/api/catalogs/areas',
    GET: (id: string) => `/api/catalogs/areas/${id}`,
    UPDATE: (id: string) => `/api/catalogs/areas/${id}`,
    DELETE: (id: string) => `/api/catalogs/areas/${id}`,
    ACTIVATE: (id: string) => `/api/catalogs/areas/${id}/activate`,
    DEACTIVATE: (id: string) => `/api/catalogs/areas/${id}/deactivate`,
    ADSCRIPCIONES: (id: string) => `/api/catalogs/areas/${id}/adscripciones`,
  },
  ADSCRIPCIONES: {
    LIST: '/api/catalogs/adscripciones',
    CREATE: '/api/catalogs/adscripciones',
    GET: (id: string) => `/api/catalogs/adscripciones/${id}`,
    UPDATE: (id: string) => `/api/catalogs/adscripciones/${id}`,
    DELETE: (id: string) => `/api/catalogs/adscripciones/${id}`,
    ACTIVATE: (id: string) => `/api/catalogs/adscripciones/${id}/activate`,
    DEACTIVATE: (id: string) => `/api/catalogs/adscripciones/${id}/deactivate`,
  },
  PUESTOS: {
    LIST: '/api/catalogs/puestos',
    CREATE: '/api/catalogs/puestos',
    GET: (id: string) => `/api/catalogs/puestos/${id}`,
    UPDATE: (id: string) => `/api/catalogs/puestos/${id}`,
    DELETE: (id: string) => `/api/catalogs/puestos/${id}`,
    ACTIVATE: (id: string) => `/api/catalogs/puestos/${id}/activate`,
    DEACTIVATE: (id: string) => `/api/catalogs/puestos/${id}/deactivate`,
  },
  DOCUMENT_TYPES: {
    LIST: '/api/catalogs/document-types',
    CREATE: '/api/catalogs/document-types',
    GET: (id: string) => `/api/catalogs/document-types/${id}`,
    UPDATE: (id: string) => `/api/catalogs/document-types/${id}`,
    DELETE: (id: string) => `/api/catalogs/document-types/${id}`,
    ACTIVATE: (id: string) => `/api/catalogs/document-types/${id}/activate`,
    DEACTIVATE: (id: string) => `/api/catalogs/document-types/${id}/deactivate`,
    BY_KIND: (kind: string) => `/api/catalogs/document-types?kind=${kind}`,
  },

  // Reportes
  REPORTS: {
    GENERATE: '/api/reports/generate',
    LIST: '/api/reports',
    DOWNLOAD: (id: string) => `/api/reports/${id}/download`,
    SUMMARY: '/api/reports/summary',
  },

  // Auditoría - Actualizado a /api/audit
  AUDIT: {
    LIST: '/api/audit',
    GET: (id: string) => `/api/audit/${id}`,
    BY_ENTITY: (entity: string, entityId: string) => `/api/audit/entity/${entity}/${entityId}`,
    BY_USER: (userId: string) => `/api/audit/user/${userId}`,
  },

  // Logs de auditoría (mantener por compatibilidad, pero usar AUDIT)
  LOGS: {
    LIST: '/api/audit',
    GET: (id: string) => `/api/audit/${id}`,
    BY_ENTITY: (entity: string, entityId: string) => `/api/audit/entity/${entity}/${entityId}`,
  },
} as const;
