/**
 * Definición centralizada de rutas de la aplicación
 */
export const ROUTES = {
  // Rutas públicas
  LOGIN: '/login',

  // Rutas protegidas (requieren autenticación)
  HOME: '/',
  DASHBOARD: '/dashboard',
  COLLABORATORS: '/colaboradores',
  COLLABORATOR_DETAIL: '/colaboradores/:id',
  COLLABORATOR_NEW: '/colaboradores/nuevo',
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
  collaboratorDetail: (id: string) => `/colaboradores/${id}`,
} as const;
