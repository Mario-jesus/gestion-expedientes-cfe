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

  // Archivos/Documentos
  FILES: {
    LIST: '/files',
    UPLOAD: '/files/upload',
    GET: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`,
    DOWNLOAD: (id: string) => `/files/${id}/download`,
    BY_EMPLOYEE: (employeeId: string) => `/files/employee/${employeeId}`,
  },

  // Reportes
  REPORTS: {
    GENERATE: '/reports/generate',
    LIST: '/reports',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
  },
} as const;
