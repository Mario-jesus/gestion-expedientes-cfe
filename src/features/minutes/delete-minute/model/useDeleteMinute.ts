import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { deleteMinute, fetchMinutes } from '@entities/minute';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';

/**
 * Hook para eliminar una minuta (baja lógica)
 */
export function useDeleteMinute(onSuccess: () => void) {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const deleteMinuteHandler = async (minuteId: string) => {
    setIsLoading(true);

    try {
      await dispatch(deleteMinute(minuteId)).unwrap();

      // Recargar minutas
      await dispatch(fetchMinutes(undefined));

      logger.info('Minuta eliminada exitosamente');
      showSuccess('Minuta eliminada exitosamente');
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al eliminar la minuta';
      logger.error('Error eliminando minuta:', error);
      showError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteMinute: deleteMinuteHandler,
    isLoading,
  };
}
