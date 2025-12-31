import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import type { PaginatedResponse, PaginationParams } from './types';

/**
 * Log de auditoría según la API real
 */
export interface AuditLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'upload' | 'download' | 'view' | 'activate' | 'deactivate' | 'login' | 'logout' | 'refresh_token' | 'change_password';
  entity: string; // User, Collaborator, Document, Minute, Area, Adscripcion, Puesto, DocumentType
  entityId: string;
  details?: Record<string, unknown>; // Información adicional
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * Filtros para búsqueda de logs de auditoría
 */
export interface AuditFilters extends PaginationParams {
  userId?: string;
  action?: string;
  entity?: string;
  entityId?: string;
  fechaDesde?: string; // ISO 8601
  fechaHasta?: string; // ISO 8601
  sortBy?: 'createdAt' | 'action' | 'entity';
  sortOrder?: 'asc' | 'desc';
}

/**
 * API para gestión de auditoría
 */
export const auditApi = {
  /**
   * Obtener todos los logs de auditoría con filtros y paginación
   */
  getAll: async (filters?: AuditFilters): Promise<PaginatedResponse<AuditLog>> => {
    const queryParams = new URLSearchParams();

    if (filters?.userId) queryParams.append('userId', filters.userId);
    if (filters?.action) queryParams.append('action', filters.action);
    if (filters?.entity) queryParams.append('entity', filters.entity);
    if (filters?.entityId) queryParams.append('entityId', filters.entityId);
    if (filters?.fechaDesde) queryParams.append('fechaDesde', filters.fechaDesde);
    if (filters?.fechaHasta) queryParams.append('fechaHasta', filters.fechaHasta);
    if (filters?.limit) queryParams.append('limit', String(filters.limit));
    if (filters?.offset) queryParams.append('offset', String(filters.offset));
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.AUDIT.LIST}?${queryString}`
      : API_ENDPOINTS.AUDIT.LIST;

    return await apiClient.get<PaginatedResponse<AuditLog>>(url);
  },

  /**
   * Obtener un log de auditoría por ID
   */
  getById: async (id: string): Promise<AuditLog> => {
    return await apiClient.get<AuditLog>(API_ENDPOINTS.AUDIT.GET(id));
  },

  /**
   * Obtener logs de auditoría de un usuario específico
   */
  getByUser: async (
    userId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AuditLog>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.AUDIT.BY_USER(userId)}?${queryString}`
      : API_ENDPOINTS.AUDIT.BY_USER(userId);

    return await apiClient.get<PaginatedResponse<AuditLog>>(url);
  },

  /**
   * Obtener logs de auditoría de una entidad específica
   */
  getByEntity: async (
    entity: string,
    entityId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<AuditLog>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));

    const queryString = queryParams.toString();
    const url = queryString
      ? `${API_ENDPOINTS.AUDIT.BY_ENTITY(entity, entityId)}?${queryString}`
      : API_ENDPOINTS.AUDIT.BY_ENTITY(entity, entityId);

    return await apiClient.get<PaginatedResponse<AuditLog>>(url);
  },
};
