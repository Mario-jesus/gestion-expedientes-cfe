import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type { PaginatedResponse, PaginationParams } from '@shared/api/types';
import type {
  Collaborator,
  CreateCollaboratorDto,
  UpdateCollaboratorDto,
  CollaboratorFilters,
} from '../model/types';

/**
 * API para gestión de colaboradores (CRUD)
 */
export const collaboratorsApi = {
  /**
   * Obtener todos los colaboradores con paginación
   * Soporta filtros mediante query params
   */
  getAll: async (filters?: CollaboratorFilters & PaginationParams): Promise<PaginatedResponse<Collaborator>> => {
    const params = new URLSearchParams();

    // Cambiar 'q' por 'search' según la API real
    if (filters?.search) params.append('search', filters.search);
    if (filters?.areaId) params.append('areaId', filters.areaId);
    if (filters?.adscripcionId) params.append('adscripcionId', filters.adscripcionId);
    if (filters?.puestoId) params.append('puestoId', filters.puestoId);
    if (filters?.tipoContrato) params.append('tipoContrato', filters.tipoContrato);
    if (filters?.estadoExpediente) params.append('estadoExpediente', filters.estadoExpediente);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    // Parámetros de paginación
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.offset) params.append('offset', String(filters.offset));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.COLLABORATORS.LIST}?${queryString}`
      : API_ENDPOINTS.COLLABORATORS.LIST;

    return await apiClient.get<PaginatedResponse<Collaborator>>(url);
  },

  /**
   * Obtener un colaborador por ID
   */
  getById: async (id: string): Promise<Collaborator> => {
    return await apiClient.get<Collaborator>(API_ENDPOINTS.COLLABORATORS.GET(id));
  },

  /**
   * Crear un nuevo colaborador
   */
  create: async (data: CreateCollaboratorDto): Promise<Collaborator> => {
    return await apiClient.post<Collaborator>(API_ENDPOINTS.COLLABORATORS.CREATE, data);
  },

  /**
   * Actualizar un colaborador existente
   */
  update: async (id: string, data: UpdateCollaboratorDto): Promise<Collaborator> => {
    return await apiClient.put<Collaborator>(API_ENDPOINTS.COLLABORATORS.UPDATE(id), data);
  },

  /**
   * Eliminar/desactivar un colaborador (baja lógica)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.COLLABORATORS.DELETE(id));
  },

  /**
   * Activar un colaborador desactivado
   */
  activate: async (id: string): Promise<Collaborator> => {
    return await apiClient.post<Collaborator>(API_ENDPOINTS.COLLABORATORS.ACTIVATE(id));
  },

  /**
   * Desactivar un colaborador (baja lógica)
   */
  deactivate: async (id: string): Promise<Collaborator> => {
    return await apiClient.post<Collaborator>(API_ENDPOINTS.COLLABORATORS.DEACTIVATE(id));
  },
};
