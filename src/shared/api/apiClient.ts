import { env, logger } from '@shared/config';
import { API_ENDPOINTS } from './endpoints';
import type { ApiErrorResponse } from './types';

interface ApiClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, body?: unknown, options?: RequestInit): Promise<T>;
  put<T>(url: string, body?: unknown, options?: RequestInit): Promise<T>;
  patch<T>(url: string, body?: unknown, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
  postFormData<T>(url: string, formData: FormData, options?: RequestInit): Promise<T>;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Flag para prevenir loops infinitos de refresh
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Limpia todos los tokens del localStorage
 */
function clearTokens(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresIn');
}

/**
 * Refresca el access token usando el refresh token
 * Implementa rotación de tokens: el nuevo refreshToken reemplaza al anterior
 */
async function refreshAccessToken(): Promise<string | null> {
  // Si ya hay un refresh en progreso, esperar a que termine
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    logger.warn('No hay refreshToken disponible');
    return null;
  }

  // Marcar que estamos refrescando
  isRefreshing = true;

  // Crear la promesa de refresh
  refreshPromise = (async (): Promise<string | null> => {
    try {
      logger.info('Refrescando access token...');

      const response = await fetch(buildUrl(API_ENDPOINTS.AUTH.REFRESH), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Refresh token inválido o expirado
        logger.error('Refresh token inválido o expirado');
        clearTokens();
        return null;
      }

      const data = await response.json() as {
        token: string;
        refreshToken: string;
        expiresIn: number;
      };

      // ⚠️ IMPORTANTE: Guardar el nuevo refreshToken (rotación)
      // El refreshToken anterior se invalida automáticamente en el backend
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpiresIn', String(data.expiresIn));

      logger.info('Token refrescado exitosamente');
      return data.token;
    } catch (error) {
      logger.error('Error refrescando token:', error);
      clearTokens();
      return null;
    } finally {
      // Resetear flags
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Construye la URL completa del endpoint
 */
function buildUrl(endpoint: string): string {
  // Si el endpoint ya es una URL completa, úsalo tal cual
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  // Si el endpoint no empieza con /, agrégalo
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${env.apiBaseUrl}${normalizedEndpoint}`;
}

async function request<T>(
  endpoint: string,
  options: RequestInit & { body?: unknown } = {},
  retryOn401 = true,
): Promise<T> {
  const token = localStorage.getItem('token');
  const url = buildUrl(endpoint);

  // No intentar refresh si es el endpoint de refresh o login
  const isAuthEndpoint = 
    endpoint === API_ENDPOINTS.AUTH.REFRESH || 
    endpoint === API_ENDPOINTS.AUTH.LOGIN;

  logger.log(`API Request: ${options.method || 'GET'} ${url}`);

  const requestBody: BodyInit | undefined =
    options.body && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : (options.body as BodyInit | undefined);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: requestBody,
  });

  // Si es 401 y no es un endpoint de auth, intentar refresh automático
  if (!response.ok && response.status === 401 && !isAuthEndpoint && retryOn401) {
    logger.info('Token expirado, intentando refresh automático...');

    const newToken = await refreshAccessToken();

    if (newToken) {
      // Reintentar la petición original con el nuevo token
      logger.info('Reintentando petición con nuevo token...');
      return request<T>(endpoint, options, false); // false para evitar loop infinito
    } else {
      // Refresh falló, limpiar tokens y lanzar error
      logger.error('No se pudo refrescar el token, limpiando sesión');
      clearTokens();

      // Lanzar error de autenticación
      const error = new Error('Sesión expirada. Por favor, inicia sesión nuevamente.') as ApiErrorResponse;
      error.status = 401;
      error.statusText = 'Unauthorized';
      throw error;
    }
  }

  if (!response.ok) {
    let errorMessage = 'Error en la petición';
    let errorData: unknown = null;

    // Obtener el texto de la respuesta una sola vez
    const text = await response.text();

    try {
      // Intentar parsear como JSON
      errorData = JSON.parse(text);
      
      // Extraer el mensaje de error del formato estándar
      if (errorData && typeof errorData === 'object') {
        const data = errorData as Record<string, unknown>;
        errorMessage = (data.message as string) || (data.error as string) || text;
      }
    } catch {
      // Si no es JSON válido, usar el texto como mensaje
      errorMessage = text || 'Error en la petición';
    }

    logger.error(`API Error: status: ${response.status} statusText: ${response.statusText} message: ${errorMessage}`);

    // Si es 401 y no pudimos refrescar, limpiar tokens
    if (response.status === 401) {
      clearTokens();
    }

    // Crear error con información estructurada
    const error = new Error(errorMessage) as ApiErrorResponse;
    error.status = response.status;
    error.statusText = response.statusText;

    // Extraer código de error si está disponible
    if (errorData && typeof errorData === 'object') {
      const data = errorData as Record<string, unknown>;
      error.code = data.code as string | undefined;
    }

    error.response = { data: errorData };

    throw error;
  }

  const data = await response.json();
  logger.log(`API Response: ${JSON.stringify(data)}`);

  return data as T;
}

/**
 * Función especializada para enviar FormData (multipart/form-data)
 * No incluye Content-Type header, el navegador lo establece automáticamente con el boundary
 */
async function requestFormData<T>(
  endpoint: string,
  formData: FormData,
  retryOn401 = true,
): Promise<T> {
  const token = localStorage.getItem('token');
  const url = buildUrl(endpoint);

  // No intentar refresh si es el endpoint de refresh o login
  const isAuthEndpoint = 
    endpoint === API_ENDPOINTS.AUTH.REFRESH || 
    endpoint === API_ENDPOINTS.AUTH.LOGIN;

  logger.log(`API Request (FormData): POST ${url}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      // NO incluir 'Content-Type', el navegador lo establece automáticamente con el boundary
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  // Si es 401 y no es un endpoint de auth, intentar refresh automático
  if (!response.ok && response.status === 401 && !isAuthEndpoint && retryOn401) {
    logger.info('Token expirado, intentando refresh automático...');

    const newToken = await refreshAccessToken();

    if (newToken) {
      // Reintentar la petición original con el nuevo token
      logger.info('Reintentando petición con nuevo token...');
      return requestFormData<T>(endpoint, formData, false); // false para evitar loop infinito
    } else {
      // Refresh falló, limpiar tokens y lanzar error
      logger.error('No se pudo refrescar el token, limpiando sesión');
      clearTokens();

      // Lanzar error de autenticación
      const error = new Error('Sesión expirada. Por favor, inicia sesión nuevamente.') as ApiErrorResponse;
      error.status = 401;
      error.statusText = 'Unauthorized';
      throw error;
    }
  }

  if (!response.ok) {
    let errorMessage = 'Error en la petición';
    let errorData: unknown = null;

    // Obtener el texto de la respuesta una sola vez
    const text = await response.text();

    try {
      // Intentar parsear como JSON
      errorData = JSON.parse(text);

      // Extraer el mensaje de error del formato estándar
      if (errorData && typeof errorData === 'object') {
        const data = errorData as Record<string, unknown>;
        errorMessage = (data.message as string) || (data.error as string) || text;
      }
    } catch {
      // Si no es JSON válido, usar el texto como mensaje
      errorMessage = text || 'Error en la petición';
    }

    logger.error(`API Error: status: ${response.status} statusText: ${response.statusText} message: ${errorMessage}`);

    // Si es 401 y no pudimos refrescar, limpiar tokens
    if (response.status === 401) {
      clearTokens();
    }

    // Crear error con información estructurada
    const error = new Error(errorMessage) as ApiErrorResponse;
    error.status = response.status;
    error.statusText = response.statusText;

    // Extraer código de error si está disponible
    if (errorData && typeof errorData === 'object') {
      const data = errorData as Record<string, unknown>;
      error.code = data.code as string | undefined;
    }

    error.response = { data: errorData };

    throw error;
  }

  const data = await response.json();
  logger.log(`API Response: ${JSON.stringify(data)}`);

  return data as T;
}

export const apiClient: ApiClient = {
  get<T>(url: string, options?: RequestInit) {
    return request<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, body?: unknown, options?: RequestInit) {
    return request<T>(url, { ...options, method: 'POST', body } as RequestInit & { body?: unknown });
  },
  put<T>(url: string, body?: unknown, options?: RequestInit) {
    return request<T>(url, { ...options, method: 'PUT', body } as RequestInit & { body?: unknown });
  },
  patch<T>(url: string, body?: unknown, options?: RequestInit) {
    return request<T>(url, { ...options, method: 'PATCH', body } as RequestInit & { body?: unknown });
  },
  delete<T>(url: string, options?: RequestInit) {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
  postFormData<T>(url: string, formData: FormData) {
    return requestFormData<T>(url, formData);
  },
};
