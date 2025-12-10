import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { deleteCollaborator as deleteCollaboratorThunk } from '@entities/collaborator';

/**
 * Hook para gestionar la eliminación de colaboradores (baja lógica)
 */
export const useDeleteCollaborator = (onSuccess?: () => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Eliminar un colaborador (baja lógica)
   */
  const deleteCollaboratorAction = async (collaboratorId: string) => {
    setError(null);
    setIsLoading(true);

    try {
      await dispatch(deleteCollaboratorThunk(collaboratorId)).unwrap();

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al eliminar colaborador';
      setError(message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Limpiar error
   */
  const clearError = () => {
    setError(null);
  };

  return {
    deleteCollaborator: deleteCollaboratorAction,
    isLoading,
    error,
    clearError,
  };
};
