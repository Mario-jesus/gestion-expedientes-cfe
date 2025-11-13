import type { CreateUserDto } from '@entities/user';

export interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  role?: string;
}

/**
 * Valida el formulario de creación de usuario
 * Retorna un objeto con los errores encontrados
 */
export const validateUserForm = (data: CreateUserDto): FormErrors => {
  const errors: FormErrors = {};

  // Nombre
  if (!data.name?.trim()) {
    errors.name = 'El nombre es obligatorio';
  } else if (data.name.trim().length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres';
  }

  // Usuario
  if (!data.username?.trim()) {
    errors.username = 'El usuario es obligatorio';
  } else if (data.username.trim().length < 4) {
    errors.username = 'El usuario debe tener al menos 4 caracteres';
  } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
    errors.username = 'El usuario solo puede contener letras, números, guiones y guiones bajos';
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = 'El correo electrónico es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'El correo electrónico no es válido';
  }

  // Contraseña
  if (!data.password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (data.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
    errors.password = 'La contraseña debe contener mayúsculas, minúsculas y números';
  }

  // Rol
  if (!data.role) {
    errors.role = 'Debes seleccionar un rol';
  } else if (data.role !== 'admin' && data.role !== 'operator') {
    errors.role = 'Rol no válido';
  }

  return errors;
};

/**
 * Verifica si hay errores en el formulario
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
