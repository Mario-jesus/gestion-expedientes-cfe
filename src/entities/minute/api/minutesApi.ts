import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type { PaginatedResponse, PaginationParams } from '@shared/api/types';
import type {
  Minute,
  UpdateMinuteDto,
  MinuteFilters,
} from '../model/types';

/**
 * API para gestión de minutas
 */
export const minutesApi = {
  /**
   * Obtener todas las minutas con filtros opcionales y paginación
   */
  getAll: async (filters?: MinuteFilters & PaginationParams): Promise<PaginatedResponse<Minute>> => {
    const queryParams = new URLSearchParams();

    // Cambiar 'q' por 'search' según la API real
    if (filters?.search) {
      queryParams.append('search', filters.search);
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

    // Parámetros de paginación
    if (filters?.limit) queryParams.append('limit', String(filters.limit));
    if (filters?.offset) queryParams.append('offset', String(filters.offset));
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.MINUTES.LIST}?${queryString}`
      : API_ENDPOINTS.MINUTES.LIST;

    return await apiClient.get<PaginatedResponse<Minute>>(endpoint);
  },

  /**
   * Obtener una minuta por ID
   */
  getById: async (id: string): Promise<Minute> => {
    return await apiClient.get<Minute>(API_ENDPOINTS.MINUTES.GET(id));
  },

  /**
   * Crear/subir una nueva minuta con archivo
   * Usa multipart/form-data para subir el archivo
   */
  create: async (
    file: File,
    data: {
      titulo: string;
      tipo: string;
      fecha: string; // ISO string
      descripcion?: string;
    }
  ): Promise<Minute> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('titulo', data.titulo);
    formData.append('tipo', data.tipo);
    formData.append('fecha', data.fecha);

    if (data.descripcion) formData.append('descripcion', data.descripcion);

    return await apiClient.postFormData<Minute>(
      API_ENDPOINTS.MINUTES.CREATE,
      formData
    );
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

  /**
   * Descargar una minuta - retorna URL para visualización
   */
  download: async (id: string): Promise<{ url: string; fileName: string }> => {
    return await apiClient.get<{ url: string; fileName: string }>(
      API_ENDPOINTS.MINUTES.DOWNLOAD(id)
    );
  },
};
