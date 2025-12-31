import { useState } from 'react';
import { minutesApi } from '@entities/minute/api/minutesApi';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';

/**
 * Hook para descargar/visualizar una minuta usando el endpoint de descarga
 */
export function useDownloadMinute() {
  const { showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const downloadMinute = async (minuteId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { url, fileName } = await minutesApi.download(minuteId);

      // Abrir en nueva pestaña
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logger.info(`Minuta descargada: ${fileName}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al descargar la minuta';
      logger.error('Error descargando minuta:', error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const viewMinute = async (minuteId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { url } = await minutesApi.download(minuteId);

      // Abrir en nueva pestaña para visualización
      window.open(url, '_blank', 'noopener,noreferrer');

      logger.info(`Minuta abierta para visualización`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al abrir la minuta';
      logger.error('Error abriendo minuta:', error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadMinute,
    viewMinute,
    isLoading,
  };
}
