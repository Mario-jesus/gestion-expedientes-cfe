/**
 * Tipos comunes para las respuestas de la API
 */

/**
 * Estructura de paginación estándar de la API
 */
export interface Pagination {
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
}

/**
 * Respuesta paginada estándar de la API
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

/**
 * Parámetros de paginación para requests
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Error estándar de la API
 */
export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Extensión del Error nativo con información de la API
 */
export interface ApiErrorResponse extends Error {
  status?: number;
  statusText?: string;
  code?: string;
  response?: { data: unknown };
}
