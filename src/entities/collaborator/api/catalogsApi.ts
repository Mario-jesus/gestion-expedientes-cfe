import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type { PaginatedResponse, PaginationParams } from '@shared/api/types';
import type {
  Area,
  Adscripcion,
  Puesto,
  DocumentType,
  CreateAreaDto,
  CreateAdscripcionDto,
  CreatePuestoDto,
  CreateDocumentTypeDto,
} from '../model/types';

/**
 * API para gestión de catálogos (Áreas, Adscripciones, Puestos, Tipos de Documento)
 */
export const catalogsApi = {
  // ========== ÁREAS ==========
  areas: {
    getAll: async (params?: PaginationParams & {
      isActive?: boolean;
      search?: string;
    }): Promise<PaginatedResponse<Area>> => {
      const queryParams = new URLSearchParams();

      if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
      if (params?.search) queryParams.append('search', params.search);
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.offset) queryParams.append('offset', String(params.offset));

      const queryString = queryParams.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.AREAS.LIST}?${queryString}`
        : API_ENDPOINTS.AREAS.LIST;

      return await apiClient.get<PaginatedResponse<Area>>(url);
    },
    getById: async (id: string): Promise<Area> => {
      return await apiClient.get<Area>(API_ENDPOINTS.AREAS.GET(id));
    },
    create: async (data: CreateAreaDto): Promise<Area> => {
      return await apiClient.post<Area>(API_ENDPOINTS.AREAS.CREATE, data);
    },
    update: async (id: string, data: Partial<CreateAreaDto>): Promise<Area> => {
      return await apiClient.put<Area>(API_ENDPOINTS.AREAS.UPDATE(id), data);
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete<void>(API_ENDPOINTS.AREAS.DELETE(id));
    },
    activate: async (id: string): Promise<Area> => {
      return await apiClient.post<Area>(API_ENDPOINTS.AREAS.ACTIVATE(id));
    },
    deactivate: async (id: string): Promise<Area> => {
      return await apiClient.post<Area>(API_ENDPOINTS.AREAS.DEACTIVATE(id));
    },
  },

  // ========== ADSCRIPCIONES ==========
  adscripciones: {
    getAll: async (params?: PaginationParams & {
      areaId?: string;
      isActive?: boolean;
    }): Promise<PaginatedResponse<Adscripcion>> => {
      const queryParams = new URLSearchParams();

      if (params?.areaId) queryParams.append('areaId', params.areaId);
      if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.offset) queryParams.append('offset', String(params.offset));

      const queryString = queryParams.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.ADSCRIPCIONES.LIST}?${queryString}`
        : API_ENDPOINTS.ADSCRIPCIONES.LIST;

      return await apiClient.get<PaginatedResponse<Adscripcion>>(url);
    },
    getById: async (id: string): Promise<Adscripcion> => {
      return await apiClient.get<Adscripcion>(API_ENDPOINTS.ADSCRIPCIONES.GET(id));
    },
    getByArea: async (areaId: string, params?: { isActive?: boolean }): Promise<{ data: Adscripcion[]; total: number }> => {
      const queryParams = new URLSearchParams();
      if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));

      const queryString = queryParams.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.AREAS.ADSCRIPCIONES(areaId)}?${queryString}`
        : API_ENDPOINTS.AREAS.ADSCRIPCIONES(areaId);

      return await apiClient.get<{ data: Adscripcion[]; total: number }>(url);
    },
    create: async (data: CreateAdscripcionDto): Promise<Adscripcion> => {
      return await apiClient.post<Adscripcion>(API_ENDPOINTS.ADSCRIPCIONES.CREATE, data);
    },
    update: async (id: string, data: Partial<CreateAdscripcionDto>): Promise<Adscripcion> => {
      return await apiClient.put<Adscripcion>(API_ENDPOINTS.ADSCRIPCIONES.UPDATE(id), data);
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete<void>(API_ENDPOINTS.ADSCRIPCIONES.DELETE(id));
    },
    activate: async (id: string): Promise<Adscripcion> => {
      return await apiClient.post<Adscripcion>(API_ENDPOINTS.ADSCRIPCIONES.ACTIVATE(id));
    },
    deactivate: async (id: string): Promise<Adscripcion> => {
      return await apiClient.post<Adscripcion>(API_ENDPOINTS.ADSCRIPCIONES.DEACTIVATE(id));
    },
  },

  // ========== PUESTOS ==========
  puestos: {
    getAll: async (params?: PaginationParams & {
      isActive?: boolean;
      search?: string;
    }): Promise<PaginatedResponse<Puesto>> => {
      const queryParams = new URLSearchParams();

      if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
      if (params?.search) queryParams.append('search', params.search);
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.offset) queryParams.append('offset', String(params.offset));

      const queryString = queryParams.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.PUESTOS.LIST}?${queryString}`
        : API_ENDPOINTS.PUESTOS.LIST;

      return await apiClient.get<PaginatedResponse<Puesto>>(url);
    },
    getById: async (id: string): Promise<Puesto> => {
      return await apiClient.get<Puesto>(API_ENDPOINTS.PUESTOS.GET(id));
    },
    create: async (data: CreatePuestoDto): Promise<Puesto> => {
      return await apiClient.post<Puesto>(API_ENDPOINTS.PUESTOS.CREATE, data);
    },
    update: async (id: string, data: Partial<CreatePuestoDto>): Promise<Puesto> => {
      return await apiClient.put<Puesto>(API_ENDPOINTS.PUESTOS.UPDATE(id), data);
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete<void>(API_ENDPOINTS.PUESTOS.DELETE(id));
    },
    activate: async (id: string): Promise<Puesto> => {
      return await apiClient.post<Puesto>(API_ENDPOINTS.PUESTOS.ACTIVATE(id));
    },
    deactivate: async (id: string): Promise<Puesto> => {
      return await apiClient.post<Puesto>(API_ENDPOINTS.PUESTOS.DEACTIVATE(id));
    },
  },

  // ========== TIPOS DE DOCUMENTO ==========
  documentTypes: {
    getAll: async (params?: PaginationParams & {
      kind?: string;
      isActive?: boolean;
    }): Promise<PaginatedResponse<DocumentType>> => {
      const queryParams = new URLSearchParams();

      if (params?.kind) queryParams.append('kind', params.kind);
      if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
      if (params?.limit) queryParams.append('limit', String(params.limit));
      if (params?.offset) queryParams.append('offset', String(params.offset));

      const queryString = queryParams.toString();
      const url = queryString 
        ? `${API_ENDPOINTS.DOCUMENT_TYPES.LIST}?${queryString}`
        : API_ENDPOINTS.DOCUMENT_TYPES.LIST;

      return await apiClient.get<PaginatedResponse<DocumentType>>(url);
    },
    getById: async (id: string): Promise<DocumentType> => {
      return await apiClient.get<DocumentType>(API_ENDPOINTS.DOCUMENT_TYPES.GET(id));
    },
    getByKind: async (kind: string): Promise<DocumentType[]> => {
      // Este endpoint retorna un array directo según la documentación
      return await apiClient.get<DocumentType[]>(API_ENDPOINTS.DOCUMENT_TYPES.BY_KIND(kind));
    },
    create: async (data: CreateDocumentTypeDto): Promise<DocumentType> => {
      return await apiClient.post<DocumentType>(API_ENDPOINTS.DOCUMENT_TYPES.CREATE, data);
    },
    update: async (id: string, data: Partial<CreateDocumentTypeDto>): Promise<DocumentType> => {
      return await apiClient.put<DocumentType>(API_ENDPOINTS.DOCUMENT_TYPES.UPDATE(id), data);
    },
    delete: async (id: string): Promise<void> => {
      await apiClient.delete<void>(API_ENDPOINTS.DOCUMENT_TYPES.DELETE(id));
    },
    activate: async (id: string): Promise<DocumentType> => {
      return await apiClient.post<DocumentType>(API_ENDPOINTS.DOCUMENT_TYPES.ACTIVATE(id));
    },
    deactivate: async (id: string): Promise<DocumentType> => {
      return await apiClient.post<DocumentType>(API_ENDPOINTS.DOCUMENT_TYPES.DEACTIVATE(id));
    },
  },
};
