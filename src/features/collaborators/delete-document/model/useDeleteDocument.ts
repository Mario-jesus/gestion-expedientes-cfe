import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { deleteDocument, fetchDocumentsByCollaborator } from '@entities/collaborator';
import { logger } from '@shared/config';

/**
 * Hook para eliminar un documento (baja lógica)
 */
export function useDeleteDocument(
  collaboratorId: string,
  onSuccess: () => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const deleteDocumentHandler = async (documentId: string) => {
    setIsLoading(true);

    try {
      await dispatch(deleteDocument(documentId)).unwrap();

      // Recargar documentos del colaborador
      await dispatch(fetchDocumentsByCollaborator(collaboratorId));

      logger.info('Documento eliminado exitosamente');
      onSuccess();
    } catch (error) {
      logger.error('Error eliminando documento:', error);
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
