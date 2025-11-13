import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type { User, CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../model/types';

/**
 * API para gestión de usuarios (CRUD)
 * Solo accesible por administradores
 */
export const usersApi = {
  /**
   * Obtener todos los usuarios del sistema
   */
  getAll: async (): Promise<User[]> => {
    return await apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
  },

  /**
   * Obtener un usuario por ID
   */
  getById: async (id: string): Promise<User> => {
    return await apiClient.get<User>(API_ENDPOINTS.USERS.GET(id));
  },

  /**
   * Crear un nuevo usuario (puede ser admin u operador)
   * El rol se especifica en el DTO
   */
  create: async (data: CreateUserDto): Promise<User> => {
    return await apiClient.post<User>(API_ENDPOINTS.USERS.CREATE, data);
  },

  /**
   * Actualizar un usuario existente
   */
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    return await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), data);
  },

  /**
   * Eliminar/desactivar un usuario
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE(id));
  },

  /**
   * Cambiar contraseña de un usuario
   */
  changePassword: async (id: string, password: string): Promise<void> => {
    const data: ChangePasswordDto = { password };
    await apiClient.post<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD(id), data);
  },

  /**
   * Alternar estado activo/inactivo de un usuario
   */
  toggleStatus: async (id: string): Promise<User> => {
    return await apiClient.post<User>(API_ENDPOINTS.USERS.TOGGLE_STATUS(id));
  },
};
