import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { usersApi, updateUser } from '@entities/user';
import type { UpdateUserDto } from '@entities/user';
import { validateEditUserForm, hasErrors, type EditFormErrors } from './validation';

/**
 * Hook para gestionar la edición de usuarios
 * Incluye validación y manejo de errores
 */
export const useEditUser = (userId: string, onSuccess?: () => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<EditFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Actualizar un usuario existente
   */
  const editUser = async (data: UpdateUserDto) => {
    // Validar datos
    const validationErrors = validateEditUserForm(data);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return { success: false };
    }

    // Limpiar errores previos
    setErrors({});
    setSubmitError(null);
    setIsLoading(true);

    try {
      const updatedUser = await usersApi.update(userId, data);
      dispatch(updateUser(updatedUser));

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar usuario';
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
    editUser,
    isLoading,
    errors,
    submitError,
    clearErrors,
    clearFieldError,
  };
};
