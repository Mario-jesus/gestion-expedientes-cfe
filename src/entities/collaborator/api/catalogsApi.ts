import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
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
    getAll: async (): Promise<Area[]> => {
      return await apiClient.get<Area[]>(API_ENDPOINTS.AREAS.LIST);
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
  },

  // ========== ADSCRIPCIONES ==========
  adscripciones: {
    getAll: async (): Promise<Adscripcion[]> => {
      return await apiClient.get<Adscripcion[]>(API_ENDPOINTS.ADSCRIPCIONES.LIST);
    },
    getById: async (id: string): Promise<Adscripcion> => {
      return await apiClient.get<Adscripcion>(API_ENDPOINTS.ADSCRIPCIONES.GET(id));
    },
    getByArea: async (areaId: string): Promise<Adscripcion[]> => {
      return await apiClient.get<Adscripcion[]>(
        API_ENDPOINTS.ADSCRIPCIONES.BY_AREA(areaId)
      );
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
  },

  // ========== PUESTOS ==========
  puestos: {
    getAll: async (): Promise<Puesto[]> => {
      return await apiClient.get<Puesto[]>(API_ENDPOINTS.PUESTOS.LIST);
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
  },

  // ========== TIPOS DE DOCUMENTO ==========
  documentTypes: {
    getAll: async (): Promise<DocumentType[]> => {
      return await apiClient.get<DocumentType[]>(API_ENDPOINTS.DOCUMENT_TYPES.LIST);
    },
    getById: async (id: string): Promise<DocumentType> => {
      return await apiClient.get<DocumentType>(API_ENDPOINTS.DOCUMENT_TYPES.GET(id));
    },
    getByKind: async (kind: string): Promise<DocumentType[]> => {
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
  },
};
