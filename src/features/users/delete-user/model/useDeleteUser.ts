import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { usersApi, removeUser } from '@entities/user';

/**
 * Hook para gestionar la eliminación de usuarios
 */
export const useDeleteUser = (onSuccess?: () => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Eliminar un usuario
   */
  const deleteUser = async (userId: string) => {
    setError(null);
    setIsLoading(true);

    try {
      await usersApi.delete(userId);
      dispatch(removeUser(userId));

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar usuario';
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
    deleteUser,
    isLoading,
    error,
    clearError,
  };
};
