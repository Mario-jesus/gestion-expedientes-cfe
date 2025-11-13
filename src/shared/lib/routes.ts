/**
 * Definición centralizada de rutas de la aplicación
 */
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',

  // Rutas protegidas (requieren autenticación)
  HOME: '/',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/expedientes',
  EMPLOYEE_DETAIL: '/expedientes/:id',
  EMPLOYEE_NEW: '/expedientes/nuevo',
  FILES: '/archivos',
  PROFILE: '/perfil',

  // Rutas de administración
  USERS: '/usuarios',
  SETTINGS: '/configuracion',
} as const;

/**
 * Helper para construir rutas con parámetros
 */
export const buildRoute = {
  employeeDetail: (id: string) => `/expedientes/${id}`,
} as const;

