import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { deleteMinute, fetchMinutes } from '@entities/minute';
import { logger } from '@shared/config';

/**
 * Hook para eliminar una minuta (baja lógica)
 */
export function useDeleteMinute(onSuccess: () => void) {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const deleteMinuteHandler = async (minuteId: string) => {
    setIsLoading(true);

    try {
      await dispatch(deleteMinute(minuteId)).unwrap();

      // Recargar minutas
      await dispatch(fetchMinutes(undefined));

      logger.info('Minuta eliminada exitosamente');
      onSuccess();
    } catch (error) {
      logger.error('Error eliminando minuta:', error);
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
