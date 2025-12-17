/**
 * Tipos y modelos relacionados con minutas
 */

/**
 * Tipo de minuta
 */
export type MinuteType = 'reunion' | 'junta' | 'acuerdo' | 'memorandum' | 'otro';

/**
 * Minuta del sistema
 * Representa un documento independiente de colaboradores
 */
export interface Minute {
  id: string;
  titulo: string;
  tipo: MinuteType;
  descripcion?: string;
  fecha: string; // Fecha de la minuta (ISO string)
  fileName: string;
  fileUrl: string; // URL o ruta del archivo
  fileSize?: number; // Tamaño en bytes
  fileType?: string; // MIME type (application/pdf, image/jpeg, etc.)
  uploadedBy: string; // ID del usuario que subió el archivo
  uploadedAt: string;
  isActive: boolean; // Para baja lógica
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear/subir una minuta
 */
export interface CreateMinuteDto {
  titulo: string;
  tipo: MinuteType;
  descripcion?: string;
  fecha: string; // ISO string
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
}

/**
 * DTO para actualizar una minuta
 */
export interface UpdateMinuteDto {
  titulo?: string;
  tipo?: MinuteType;
  descripcion?: string;
  fecha?: string;
  fileName?: string;
}

/**
 * Filtros para búsqueda de minutas
 */
export interface MinuteFilters {
  search?: string; // Búsqueda por título o descripción
  tipo?: MinuteType;
  fechaDesde?: string; // ISO string
  fechaHasta?: string; // ISO string
  isActive?: boolean;
}
