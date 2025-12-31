import { useState } from 'react';
import { documentsApi } from '@entities/collaborator/api/documentsApi';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';

/**
 * Hook para descargar/visualizar un documento usando el endpoint de descarga
 */
export function useDownloadDocument() {
  const { showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const downloadDocument = async (documentId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { url, fileName } = await documentsApi.download(documentId);

      // Abrir en nueva pestaña
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logger.info(`Documento descargado: ${fileName}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al descargar el documento';
      logger.error('Error descargando documento:', error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const viewDocument = async (documentId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { url } = await documentsApi.download(documentId);

      // Abrir en nueva pestaña para visualización
      window.open(url, '_blank', 'noopener,noreferrer');

      logger.info(`Documento abierto para visualización`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al abrir el documento';
      logger.error('Error abriendo documento:', error);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadDocument,
    viewDocument,
    isLoading,
  };
}
