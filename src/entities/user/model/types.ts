/**
 * Tipos y roles de usuario del sistema
 */
export type UserRole = 'admin' | 'operator';

/**
 * Usuario del sistema
 * Usado tanto para sesión actual como para gestión de usuarios
 */
export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string; // ID del admin que lo creó
}

/**
 * DTO para crear un nuevo usuario
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name: string;
  role: UserRole; // Admin puede elegir el rol
  isActive?: boolean; // Por defecto será true si no se especifica
}

/**
 * DTO para actualizar un usuario existente
 */
export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole; // Admin puede cambiar roles
  isActive?: boolean;
}

/**
 * DTO para cambiar contraseña
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
