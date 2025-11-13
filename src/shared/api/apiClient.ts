import { env, logger } from '@shared/config';

interface ApiClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, body?: unknown, options?: RequestInit): Promise<T>;
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

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
): Promise<T> {
  const token = localStorage.getItem('token');
  const url = buildUrl(endpoint);

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

  if (!response.ok) {
    const message = await response.text();
    logger.error(`API Error: status: ${response.status} statusText: ${response.statusText} message: ${message}`);

    // Si es 401, el token expiró - limpiar localStorage
    if (response.status === 401) {
      localStorage.removeItem('token');
    }

    throw new Error(message || 'Error en la petición');
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
};
