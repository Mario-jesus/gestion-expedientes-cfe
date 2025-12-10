import { apiClient } from '@shared/api/apiClient';
import { API_ENDPOINTS } from '@shared/api/endpoints';
import type {
  CollaboratorDocument,
  CreateDocumentDto,
  UpdateDocumentDto,
} from '../model/types';

/**
 * API para gestión de documentos de colaboradores
 */
export const documentsApi = {
  /**
   * Obtener todos los documentos
   */
  getAll: async (): Promise<CollaboratorDocument[]> => {
    return await apiClient.get<CollaboratorDocument[]>(API_ENDPOINTS.DOCUMENTS.LIST);
  },

  /**
   * Obtener documentos de un colaborador específico
   */
  getByCollaborator: async (collaboratorId: string): Promise<CollaboratorDocument[]> => {
    return await apiClient.get<CollaboratorDocument[]>(
      API_ENDPOINTS.DOCUMENTS.BY_COLLABORATOR(collaboratorId)
    );
  },

  /**
   * Obtener un documento por ID
   */
  getById: async (id: string): Promise<CollaboratorDocument> => {
    return await apiClient.get<CollaboratorDocument>(API_ENDPOINTS.DOCUMENTS.GET(id));
  },

  /**
   * Crear/subir un nuevo documento
   */
  create: async (data: CreateDocumentDto): Promise<CollaboratorDocument> => {
    return await apiClient.post<CollaboratorDocument>(API_ENDPOINTS.DOCUMENTS.CREATE, data);
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
   * Descargar un documento (retorna URL o blob según implementación)
   * Nota: En el mock API, esto no está implementado.
   * En producción, se obtendría el documento y se retornaría como Blob.
   */
  download: async (_id: string): Promise<Blob> => {
    // En una implementación real:
    // 1. Obtener el documento: const doc = await apiClient.get<CollaboratorDocument>(API_ENDPOINTS.DOCUMENTS.GET(id))
    // 2. Hacer fetch al fileUrl
    // 3. Retornar el blob
    throw new Error('Download not implemented in mock API');
  },
};
