import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { updateMinuteThunk, fetchMinutes } from '@entities/minute';
import type { UpdateMinuteDto, Minute } from '@entities/minute';
import { logger } from '@shared/config';
import { useToast } from '@shared/providers';

interface EditMinuteErrors {
  titulo?: string;
  tipo?: string;
  fecha?: string;
  descripcion?: string;
  fileName?: string;
}

/**
 * Hook para editar metadatos de una minuta
 */
export function useEditMinute(
  minute: Minute,
  onSuccess: () => void
) {
  const dispatch = useDispatch<AppDispatch>();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<EditMinuteErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const clearFieldError = (field: keyof EditMinuteErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = (data: UpdateMinuteDto): boolean => {
    const newErrors: EditMinuteErrors = {};

    if (data.titulo !== undefined) {
      if (!data.titulo.trim()) {
        newErrors.titulo = 'El título es requerido';
      } else if (data.titulo.trim().length < 3) {
        newErrors.titulo = 'El título debe tener al menos 3 caracteres';
      } else if (data.titulo.trim().length > 255) {
        newErrors.titulo = 'El título no puede exceder 255 caracteres';
      }
    }

    if (data.fecha !== undefined) {
      if (!data.fecha) {
        newErrors.fecha = 'La fecha es requerida';
      } else {
        const date = new Date(data.fecha);
        if (isNaN(date.getTime())) {
          newErrors.fecha = 'La fecha no es válida';
        }
      }
    }

    if (data.descripcion !== undefined && data.descripcion.trim().length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    if (data.fileName !== undefined) {
      if (!data.fileName.trim()) {
        newErrors.fileName = 'El nombre del archivo es requerido';
      } else if (data.fileName.trim().length < 3) {
        newErrors.fileName = 'El nombre debe tener al menos 3 caracteres';
      } else if (data.fileName.trim().length > 255) {
        newErrors.fileName = 'El nombre no puede exceder 255 caracteres';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const editMinute = async (data: UpdateMinuteDto) => {
    setSubmitError(null);
    setErrors({});

    if (!validate(data)) {
      return;
    }

    setIsLoading(true);

    try {
      const updateData: UpdateMinuteDto = {};

      if (data.titulo !== undefined && data.titulo.trim() !== minute.titulo) {
        updateData.titulo = data.titulo.trim();
      }

      if (data.tipo !== undefined && data.tipo !== minute.tipo) {
        updateData.tipo = data.tipo;
      }

      if (data.fecha !== undefined && data.fecha !== minute.fecha.split('T')[0]) {
        updateData.fecha = data.fecha;
      }

      if (data.descripcion !== undefined) {
        updateData.descripcion = data.descripcion.trim() || undefined;
      }

      if (data.fileName !== undefined && data.fileName.trim() !== minute.fileName) {
        updateData.fileName = data.fileName.trim();
      }

      // Solo actualizar si hay cambios
      if (Object.keys(updateData).length === 0) {
        logger.info('No hay cambios para actualizar');
        setIsLoading(false);
        onSuccess();
        return;
      }

      await dispatch(
        updateMinuteThunk({
          id: minute.id,
          data: updateData,
        })
      ).unwrap();

      // Recargar minutas
      await dispatch(fetchMinutes(undefined));

      logger.info('Minuta actualizada exitosamente');
      showSuccess('Minuta actualizada exitosamente');
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al actualizar la minuta. Intenta nuevamente.';
      logger.error('Error actualizando minuta:', error);
      setSubmitError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editMinute,
    isLoading,
    errors,
    submitError,
    clearFieldError,
  };
}
