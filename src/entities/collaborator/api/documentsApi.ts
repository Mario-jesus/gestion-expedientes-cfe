import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type { PaginatedResponse, PaginationParams } from '@shared/api/types';
import type {
  CollaboratorDocument,
  UpdateDocumentDto,
} from '../model/types';

/**
 * API para gestión de documentos de colaboradores
 */
export const documentsApi = {
  /**
   * Obtener todos los documentos con paginación
   */
  getAll: async (params?: PaginationParams & {
    collaboratorId?: string;
    kind?: string;
    isActive?: boolean;
    documentTypeId?: string;
  }): Promise<PaginatedResponse<CollaboratorDocument>> => {
    const queryParams = new URLSearchParams();

    if (params?.collaboratorId) queryParams.append('collaboratorId', params.collaboratorId);
    if (params?.kind) queryParams.append('kind', params.kind);
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
    if (params?.documentTypeId) queryParams.append('documentTypeId', params.documentTypeId);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.DOCUMENTS.LIST}?${queryString}`
      : API_ENDPOINTS.DOCUMENTS.LIST;

    return await apiClient.get<PaginatedResponse<CollaboratorDocument>>(url);
  },

  /**
   * Obtener documentos de un colaborador específico
   * Nota: La API real retorna un objeto con data y total, no paginación completa
   */
  getByCollaborator: async (collaboratorId: string, params?: {
    kind?: string;
    isActive?: boolean;
  }): Promise<{ data: CollaboratorDocument[]; total: number }> => {
    const queryParams = new URLSearchParams();
    if (params?.kind) queryParams.append('kind', params.kind);
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.COLLABORATORS.DOCUMENTS(collaboratorId)}?${queryString}`
      : API_ENDPOINTS.COLLABORATORS.DOCUMENTS(collaboratorId);

    return await apiClient.get<{ data: CollaboratorDocument[]; total: number }>(url);
  },

  /**
   * Obtener un documento por ID
   */
  getById: async (id: string): Promise<CollaboratorDocument> => {
    return await apiClient.get<CollaboratorDocument>(API_ENDPOINTS.DOCUMENTS.GET(id));
  },

  /**
   * Crear/subir un nuevo documento con archivo
   * Usa multipart/form-data para subir el archivo
   */
  create: async (
    file: File,
    data: {
      collaboratorId: string;
      kind: string;
      periodo?: string;
      descripcion?: string;
      documentTypeId?: string;
    }
  ): Promise<CollaboratorDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collaboratorId', data.collaboratorId);
    formData.append('kind', data.kind);

    if (data.periodo) formData.append('periodo', data.periodo);
    if (data.descripcion) formData.append('descripcion', data.descripcion);
    if (data.documentTypeId) formData.append('documentTypeId', data.documentTypeId);

    return await apiClient.postFormData<CollaboratorDocument>(
      API_ENDPOINTS.DOCUMENTS.CREATE,
      formData
    );
  },

  /**
   * Actualizar metadatos de un documento
   */
  update: async (id: string, data: UpdateDocumentDto): Promise<CollaboratorDocument> => {
    return await apiClient.put<CollaboratorDocument>(API_ENDPOINTS.DOCUMENTS.UPDATE(id), data);
  },

  /**
   * Eliminar un documento (baja lógica)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.DOCUMENTS.DELETE(id));
  },

  /**
   * Descargar un documento - retorna URL para visualización
   */
  download: async (id: string): Promise<{ url: string; fileName: string }> => {
    return await apiClient.get<{ url: string; fileName: string }>(
      API_ENDPOINTS.DOCUMENTS.DOWNLOAD(id)
    );
  },
};
