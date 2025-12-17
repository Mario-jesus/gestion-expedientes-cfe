import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type {
  Minute,
  CreateMinuteDto,
  UpdateMinuteDto,
  MinuteFilters,
} from '../model/types';

/**
 * API para gestión de minutas
 */
export const minutesApi = {
  /**
   * Obtener todas las minutas con filtros opcionales
   */
  getAll: async (filters?: MinuteFilters): Promise<Minute[]> => {
    const queryParams = new URLSearchParams();

    if (filters?.search) {
      queryParams.append('q', filters.search);
    }
    if (filters?.tipo) {
      queryParams.append('tipo', filters.tipo);
    }
    if (filters?.fechaDesde) {
      queryParams.append('fechaDesde', filters.fechaDesde);
    }
    if (filters?.fechaHasta) {
      queryParams.append('fechaHasta', filters.fechaHasta);
    }
    if (filters?.isActive !== undefined) {
      queryParams.append('isActive', String(filters.isActive));
    }

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.MINUTES.LIST}?${queryString}`
      : API_ENDPOINTS.MINUTES.LIST;

    return await apiClient.get<Minute[]>(endpoint);
  },

  /**
   * Obtener una minuta por ID
   */
  getById: async (id: string): Promise<Minute> => {
    return await apiClient.get<Minute>(API_ENDPOINTS.MINUTES.GET(id));
  },

  /**
   * Crear/subir una nueva minuta
   */
  create: async (data: CreateMinuteDto): Promise<Minute> => {
    return await apiClient.post<Minute>(API_ENDPOINTS.MINUTES.CREATE, data);
  },

  /**
   * Actualizar una minuta
   */
  update: async (id: string, data: UpdateMinuteDto): Promise<Minute> => {
    return await apiClient.put<Minute>(API_ENDPOINTS.MINUTES.UPDATE(id), data);
  },

  /**
   * Eliminar una minuta (baja lógica)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.MINUTES.DELETE(id));
  },
};
