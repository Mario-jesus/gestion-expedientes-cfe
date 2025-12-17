/**
 * Definición centralizada de endpoints del API backend
 */
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },

  // Usuarios
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    TOGGLE_STATUS: (id: string) => `/users/${id}/toggle-status`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
  },

  // Expedientes/Colaboradores
  EMPLOYEES: {
    LIST: '/employees',
    CREATE: '/employees',
    GET: (id: string) => `/employees/${id}`,
    UPDATE: (id: string) => `/employees/${id}`,
    DELETE: (id: string) => `/employees/${id}`,
    SEARCH: '/employees/search',
  },

  // Minutas
  MINUTES: {
    LIST: '/minutes',
    CREATE: '/minutes',
    GET: (id: string) => `/minutes/${id}`,
    UPDATE: (id: string) => `/minutes/${id}`,
    DELETE: (id: string) => `/minutes/${id}`,
    DOWNLOAD: (id: string) => `/minutes/${id}/download`,
  },

  // Colaboradores
  COLLABORATORS: {
    LIST: '/collaborators',
    CREATE: '/collaborators',
    GET: (id: string) => `/collaborators/${id}`,
    UPDATE: (id: string) => `/collaborators/${id}`,
    DELETE: (id: string) => `/collaborators/${id}`,
    SEARCH: '/collaborators/search',
    TOGGLE_STATUS: (id: string) => `/collaborators/${id}/toggle-status`,
  },

  // Documentos de colaboradores
  DOCUMENTS: {
    LIST: '/documents',
    CREATE: '/documents',
    GET: (id: string) => `/documents/${id}`,
    UPDATE: (id: string) => `/documents/${id}`,
    DELETE: (id: string) => `/documents/${id}`,
    BY_COLLABORATOR: (collaboratorId: string) => `/collaborators/${collaboratorId}/documents`,
    DOWNLOAD: (id: string) => `/documents/${id}/download`,
  },

  // Catálogos
  AREAS: {
    LIST: '/areas',
    CREATE: '/areas',
    GET: (id: string) => `/areas/${id}`,
    UPDATE: (id: string) => `/areas/${id}`,
    DELETE: (id: string) => `/areas/${id}`,
  },
  ADSCRIPCIONES: {
    LIST: '/adscripciones',
    CREATE: '/adscripciones',
    GET: (id: string) => `/adscripciones/${id}`,
    UPDATE: (id: string) => `/adscripciones/${id}`,
    DELETE: (id: string) => `/adscripciones/${id}`,
    BY_AREA: (areaId: string) => `/areas/${areaId}/adscripciones`,
  },
  PUESTOS: {
    LIST: '/puestos',
    CREATE: '/puestos',
    GET: (id: string) => `/puestos/${id}`,
    UPDATE: (id: string) => `/puestos/${id}`,
    DELETE: (id: string) => `/puestos/${id}`,
  },
  DOCUMENT_TYPES: {
    LIST: '/documentTypes',
    CREATE: '/documentTypes',
    GET: (id: string) => `/documentTypes/${id}`,
    UPDATE: (id: string) => `/documentTypes/${id}`,
    DELETE: (id: string) => `/documentTypes/${id}`,
    BY_KIND: (kind: string) => `/documentTypes?kind=${kind}`,
  },

  // Reportes
  REPORTS: {
    GENERATE: '/reports/generate',
    LIST: '/reports',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    SUMMARY: '/reports/summary',
  },

  // Logs de auditoría
  LOGS: {
    LIST: '/logs',
    CREATE: '/logs',
    GET: (id: string) => `/logs/${id}`,
    BY_ENTITY: (entity: string, entityId: string) => `/logs?entity=${entity}&entityId=${entityId}`,
  },
} as const;
