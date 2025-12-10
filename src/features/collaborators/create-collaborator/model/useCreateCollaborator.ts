import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { createCollaborator as createCollaboratorThunk } from '@entities/collaborator';
import type { CreateCollaboratorDto } from '@entities/collaborator';
import {
  validateCollaboratorForm,
  hasErrors,
  type FormErrors,
} from './validation';

/**
 * Hook para gestionar la creación de colaboradores
 * Incluye validación y manejo de errores
 */
export const useCreateCollaborator = (onSuccess?: () => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Crear un nuevo colaborador
   */
  const create = async (data: CreateCollaboratorDto) => {
    // Validar datos
    const validationErrors = validateCollaboratorForm(data);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return { success: false };
    }

    // Limpiar errores previos
    setErrors({});
    setSubmitError(null);
    setIsLoading(true);

    try {
      await dispatch(createCollaboratorThunk(data)).unwrap();

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al crear colaborador';
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
  const clearFieldError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    createCollaborator: create,
    isLoading,
    errors,
    submitError,
    clearErrors,
    clearFieldError,
  };
};
