import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
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
   * Obtener todos los colaboradores
   * Soporta filtros mediante query params
   */
  getAll: async (filters?: CollaboratorFilters): Promise<Collaborator[]> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('q', filters.search);
    if (filters?.areaId) params.append('areaId', filters.areaId);
    if (filters?.adscripcionId) params.append('adscripcionId', filters.adscripcionId);
    if (filters?.puestoId) params.append('puestoId', filters.puestoId);
    if (filters?.tipoContrato) params.append('tipoContrato', filters.tipoContrato);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.COLLABORATORS.LIST}?${queryString}`
      : API_ENDPOINTS.COLLABORATORS.LIST;

    return await apiClient.get<Collaborator[]>(url);
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
   * Alternar estado activo/inactivo de un colaborador
   */
  toggleStatus: async (id: string): Promise<Collaborator> => {
    return await apiClient.post<Collaborator>(API_ENDPOINTS.COLLABORATORS.TOGGLE_STATUS(id));
  },
};
