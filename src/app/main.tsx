import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@app/index';
import { validateEnv, logger } from '@shared/config';
import '@app/styles/index.scss';

// Validar variables de entorno al inicio
try {
  validateEnv();
  logger.info('Variables de entorno validadas correctamente');
} catch (error) {
  console.error('Error en la configuración:', error);
  throw error;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
