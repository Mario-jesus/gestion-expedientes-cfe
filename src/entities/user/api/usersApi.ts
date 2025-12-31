import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type { PaginatedResponse, PaginationParams } from '@shared/api/types';
import type { AuditLog } from '@shared/api/auditApi';
import type { User, CreateUserDto, UpdateUserDto, ChangePasswordDto } from '../model/types';

/**
 * API para gestión de usuarios (CRUD)
 * Solo accesible por administradores
 */
export const usersApi = {
  /**
   * Obtener todos los usuarios del sistema con paginación
   */
  getAll: async (params?: PaginationParams & {
    search?: string;
    role?: 'admin' | 'operator';
    isActive?: boolean;
  }): Promise<PaginatedResponse<User>> => {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.USERS.LIST}?${queryString}`
      : API_ENDPOINTS.USERS.LIST;

    return await apiClient.get<PaginatedResponse<User>>(url);
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
  changePassword: async (id: string, data: ChangePasswordDto): Promise<void> => {
    await apiClient.post<void>(API_ENDPOINTS.USERS.CHANGE_PASSWORD(id), data);
  },

  /**
   * Obtener el perfil del usuario actual
   * Usa GET /api/auth/me (no GET /api/users/me que no existe)
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return response.user;
  },

  /**
   * Actualizar el perfil propio (solo nombre y email)
   */
  updateMe: async (data: { name?: string; email?: string }): Promise<User> => {
    return await apiClient.patch<User>(API_ENDPOINTS.USERS.ME, data);
  },

  /**
   * Obtener el historial de actividad del usuario actual
   */
  getMyActivity: async (params?: PaginationParams): Promise<PaginatedResponse<AuditLog>> => {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.USERS.ME_ACTIVITY}?${queryString}`
      : API_ENDPOINTS.USERS.ME_ACTIVITY;

    return await apiClient.get<PaginatedResponse<AuditLog>>(url);
  },

  /**
   * Activar un usuario desactivado
   */
  activate: async (id: string): Promise<User> => {
    return await apiClient.post<User>(API_ENDPOINTS.USERS.ACTIVATE(id));
  },

  /**
   * Desactivar un usuario (baja lógica)
   */
  deactivate: async (id: string): Promise<User> => {
    return await apiClient.post<User>(API_ENDPOINTS.USERS.DEACTIVATE(id));
  },

  /**
   * Cerrar sesión del usuario actual
   * Invalida el token en el servidor
   */
  logout: async (): Promise<void> => {
    await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
