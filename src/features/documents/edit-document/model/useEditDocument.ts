import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { updateDocumentThunk } from '@entities/collaborator/model/documentsThunks';
import type { UpdateDocumentDto } from '@entities/collaborator';
import { logger } from '@shared/config';

interface UseEditDocumentOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useEditDocument({
  onSuccess,
  onError,
}: UseEditDocumentOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editDocument = async (id: string, data: UpdateDocumentDto) => {
    try {
      setIsLoading(true);
      setError(null);

      logger.info(`Editando documento ${id}...`, data);
      await dispatch(updateDocumentThunk({ id, data })).unwrap();

      logger.info('Documento actualizado exitosamente');
      onSuccess?.();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al actualizar el documento';
      logger.error('Error actualizando documento:', err);
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editDocument,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
