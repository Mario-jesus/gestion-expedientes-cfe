import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { deleteDocument, fetchDocumentsByCollaborator } from '@entities/collaborator';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';

/**
 * Hook para eliminar un documento (baja lógica)
 */
export function useDeleteDocument(
  collaboratorId: string,
  onSuccess: () => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deleteDocumentHandler = async (documentId: string) => {
    setIsLoading(true);

    try {
      await dispatch(deleteDocument(documentId)).unwrap();

      // Recargar documentos del colaborador
      await dispatch(fetchDocumentsByCollaborator(collaboratorId));

      logger.info('Documento eliminado exitosamente');
      showSuccess('Documento eliminado exitosamente');
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al eliminar el documento';
      logger.error('Error eliminando documento:', error);
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteDocument: deleteDocumentHandler,
    isLoading,
  };
}
