import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@app/providers/store';
import { usersApi, addUser } from '@entities/user';
import type { CreateUserDto } from '@entities/user';
import { validateUserForm, hasErrors, type FormErrors } from './validation';

/**
 * Hook para gestionar la creación de usuarios
 * Incluye validación y manejo de errores
 */
export const useCreateUser = (onSuccess?: () => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Crear un nuevo usuario
   */
  const createUser = async (data: CreateUserDto) => {
    // Validar datos
    const validationErrors = validateUserForm(data);
    
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return { success: false };
    }

    // Limpiar errores previos
    setErrors({});
    setSubmitError(null);
    setIsLoading(true);

    try {
      const newUser = await usersApi.create(data);
      dispatch(addUser(newUser));

      // Llamar callback de éxito
      if (onSuccess) {
        onSuccess();
      }

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear usuario';
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
    createUser,
    isLoading,
    errors,
    submitError,
    clearErrors,
    clearFieldError,
  };
};
