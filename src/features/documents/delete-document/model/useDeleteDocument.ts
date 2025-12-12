import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { deleteDocument } from '@entities/collaborator/model/documentsThunks';
import { logger } from '@shared/config';

interface UseDeleteDocumentOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useDeleteDocument({
  onSuccess,
  onError,
}: UseDeleteDocumentOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDocumentById = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      logger.info(`Eliminando documento ${id}...`);
      await dispatch(deleteDocument(id)).unwrap();

      logger.info('Documento eliminado exitosamente');
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al eliminar el documento';
      logger.error('Error eliminando documento:', err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteDocument: deleteDocumentById,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
