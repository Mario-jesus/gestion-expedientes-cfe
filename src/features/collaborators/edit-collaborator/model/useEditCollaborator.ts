import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { updateCollaboratorThunk } from '@entities/collaborator';
import type { UpdateCollaboratorDto } from '@entities/collaborator';
import {
  validateEditCollaboratorForm,
  hasErrors,
  type EditFormErrors,
} from './validation';

/**
 * Hook para gestionar la edición de colaboradores
 * Incluye validación y manejo de errores
 */
export const useEditCollaborator = (
  collaboratorId: string,
  onSuccess?: () => void
) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<EditFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Actualizar un colaborador existente
   */
  const editCollaborator = async (data: UpdateCollaboratorDto) => {
    // Validar datos
    const validationErrors = validateEditCollaboratorForm(data);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return { success: false };
    }

    // Limpiar errores previos
    setErrors({});
    setSubmitError(null);
    setIsLoading(true);

    try {
      await dispatch(
        updateCollaboratorThunk({ id: collaboratorId, data })
      ).unwrap();

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Error al actualizar colaborador';
      setSubmitError(message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Limpiar errores de validación
   */
  const clearErrors = () => {
    setErrors({});
    setSubmitError(null);
  };

  /**
   * Limpiar un error específico de un campo
   */
  const clearFieldError = (field: keyof EditFormErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    editCollaborator,
    isLoading,
    errors,
    submitError,
    clearErrors,
    clearFieldError,
  };
};
