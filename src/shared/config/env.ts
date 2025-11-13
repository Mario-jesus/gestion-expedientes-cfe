/**
 * Configuración de variables de entorno
 * Centraliza el acceso a las variables de entorno de Vite
 */

export const env = {
  // Ambiente
  appEnv: import.meta.env.VITE_APP_ENV,
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',

  // API
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

  // Información de la app
  appName: import.meta.env.VITE_APP_NAME,
  appVersion: import.meta.env.VITE_APP_VERSION,

  // Configuraciones
  enableLogger: import.meta.env.VITE_ENABLE_LOGGER === 'true',
  minLogLevel: import.meta.env.VITE_MIN_LOG_LEVEL,
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
} as const;

/**
 * Valida que todas las variables de entorno requeridas estén definidas
 */
export function validateEnv(): void {
  const requiredVars = [
    'VITE_APP_ENV',
    'VITE_API_BASE_URL',
    'VITE_APP_NAME',
    'VITE_APP_VERSION',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${missingVars.join(', ')}`
    );
  }
}

const minLogLevel = import.meta.env.VITE_MIN_LOG_LEVEL ? import.meta.env.VITE_MIN_LOG_LEVEL : 'info';

/**
 * Logger condicional basado en el ambiente
 */
export const logger = {
  log: (...args: unknown[]) => {
    if (env.enableLogger && minLogLevel === 'debug') {
      console.log('[LOG]', ...args);
    }
  },
  error: (...args: unknown[]) => {
    if (env.enableLogger && minLogLevel === 'error') {
      console.error('[ERROR]', ...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (env.enableLogger && minLogLevel === 'warn') {
      console.warn('[WARN]', ...args);
    }
  },
  info: (...args: unknown[]) => {
    if (env.enableLogger && minLogLevel === 'info') {
      console.info('[INFO]', ...args);
    }
  },
};
