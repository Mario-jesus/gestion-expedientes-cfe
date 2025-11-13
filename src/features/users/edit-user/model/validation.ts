import type { UpdateUserDto } from '@entities/user';

export interface EditFormErrors {
  email?: string;
  name?: string;
  role?: string;
}

/**
 * Valida el formulario de edición de usuario
 * No se valida username porque no se puede cambiar
 * No se valida contraseña porque se cambia por separado
 */
export const validateEditUserForm = (data: UpdateUserDto): EditFormErrors => {
  const errors: EditFormErrors = {};

  // Nombre (opcional pero si se proporciona debe ser válido)
  if (data.name !== undefined) {
    if (!data.name.trim()) {
      errors.name = 'El nombre no puede estar vacío';
    } else if (data.name.trim().length < 3) {
      errors.name = 'El nombre debe tener al menos 3 caracteres';
    }
  }

  // Email (opcional pero si se proporciona debe ser válido)
  if (data.email !== undefined) {
    if (!data.email.trim()) {
      errors.email = 'El correo no puede estar vacío';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'El correo electrónico no es válido';
    }
  }

  // Rol (opcional pero si se proporciona debe ser válido)
  if (data.role !== undefined) {
    if (data.role !== 'admin' && data.role !== 'operator') {
      errors.role = 'Rol no válido';
    }
  }

  return errors;
};

/**
 * Verifica si hay errores en el formulario
 */
export const hasErrors = (errors: EditFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
