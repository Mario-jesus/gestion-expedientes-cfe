/**
 * Tipos y modelos relacionados con colaboradores y expedientes
 */

/**
 * Tipo de contrato del colaborador
 */
export type ContractType = 'confianza' | 'temporal_de_confianza' | 'sindicalizados' | 'temporal_sindicalizado' | 'otro';

/**
 * Tipo de documento del expediente
 */
export type DocumentKind = 'bateria' | 'c0_03' | 'historial' | 'perfil' | 'constancia' | 'otro';

/**
 * Estado del expediente basado en documentos
 */
export type ExpedienteStatus = 'completo' | 'incompleto' | 'sin_documentos';

/**
 * Colaborador de CFE
 * Representa un empleado con su expediente digital
 */
export interface Collaborator {
  id: string;
  nombre: string;
  apellidos: string;
  rpe: string; // Registro de Personal de Empleados
  rtt?: string; // Registro de Trabajadores Temporales (opcional)
  areaId: string;
  adscripcionId: string;
  puestoId: string;
  tipoContrato: ContractType;
  rfc: string;
  curp: string;
  imss: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string; // ID del usuario que lo creó
}

/**
 * DTO para crear un nuevo colaborador
 */
export interface CreateCollaboratorDto {
  nombre: string;
  apellidos: string;
  rpe: string;
  rtt?: string;
  areaId: string;
  adscripcionId: string;
  puestoId: string;
  tipoContrato: ContractType;
  rfc: string;
  curp: string;
  imss: string;
  isActive?: boolean; // Por defecto true
}

/**
 * DTO para actualizar un colaborador existente
 */
export interface UpdateCollaboratorDto {
  nombre?: string;
  apellidos?: string;
  rpe?: string;
  rtt?: string;
  areaId?: string;
  adscripcionId?: string;
  puestoId?: string;
  tipoContrato?: ContractType;
  rfc?: string;
  curp?: string;
  imss?: string;
  isActive?: boolean;
}

/**
 * Documento del expediente del colaborador
 * Estructura unificada para todos los tipos de documentos
 */
export interface CollaboratorDocument {
  id: string;
  collaboratorId: string;
  kind: DocumentKind;
  periodo?: string; // Para historiales y constancias (ej: "2024-Q1", "2024")
  descripcion?: string; // Descripción opcional del documento
  fileName: string;
  fileUrl: string; // URL o ruta del archivo (en mock será una URL simulada)
  fileSize?: number; // Tamaño en bytes
  fileType?: string; // MIME type (application/pdf, image/jpeg, etc.)
  uploadedBy: string; // ID del usuario que subió el archivo
  uploadedAt: string;
  isActive: boolean; // Para baja lógica
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear/subir un documento
 */
export interface CreateDocumentDto {
  collaboratorId: string;
  kind: DocumentKind;
  periodo?: string;
  descripcion?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  fileType?: string;
}

/**
 * DTO para actualizar metadatos de un documento
 */
export interface UpdateDocumentDto {
  periodo?: string;
  descripcion?: string;
  fileName?: string;
}

/**
 * Catálogo de Áreas
 */
export interface Area {
  id: string;
  nombre: string;
  descripcion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Catálogo de Adscripciones
 */
export interface Adscripcion {
  id: string;
  nombre: string;
  adscripcion: string; // Nombre específico de la adscripción (ej: "Area benemérito", "Agencia benemérita")
  descripcion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Catálogo de Puestos
 */
export interface Puesto {
  id: string;
  nombre: string;
  descripcion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Catálogo de Tipos de Documento (para clasificar "otros documentos")
 */
export interface DocumentType {
  id: string;
  nombre: string;
  kind: DocumentKind; // Tipo principal al que pertenece
  descripcion?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTOs para catálogos
 */
export interface CreateAreaDto {
  nombre: string;
  descripcion?: string;
}

export interface CreateAdscripcionDto {
  nombre: string;
  adscripcion: string;
  descripcion?: string;
}

export interface CreatePuestoDto {
  nombre: string;
  descripcion?: string;
}

export interface CreateDocumentTypeDto {
  nombre: string;
  kind: DocumentKind;
  descripcion?: string;
}

/**
 * Log de auditoría
 */
export interface LogEntry {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'download' | 'upload' | 'view';
  entity: 'collaborator' | 'document' | 'area' | 'adscripcion' | 'puesto' | 'documentType';
  entityId: string;
  metadata?: Record<string, unknown>; // Información adicional (ej: nombre del archivo descargado)
  createdAt: string;
}

/**
 * Estado del expediente calculado
 */
export interface ExpedienteStatusInfo {
  status: ExpedienteStatus;
  hasBateria: boolean;
  hasHistorial: boolean;
  hasPerfil: boolean;
  hasConstancias: boolean;
  hasOtros: boolean;
  totalDocumentos: number;
  documentosCompletos: number;
}

/**
 * Filtros para búsqueda de colaboradores
 */
export interface CollaboratorFilters {
  search?: string; // Búsqueda por nombre, apellidos o RPE
  areaId?: string;
  adscripcionId?: string;
  puestoId?: string;
  tipoContrato?: ContractType;
  estadoExpediente?: ExpedienteStatus;
  isActive?: boolean;
}

/**
 * Respuesta de reporte de resumen
 */
export interface ReportSummary {
  totalColaboradores: number;
  completos: number;
  incompletos: number;
  sinDocumentos: number;
  porArea: Record<string, {
    total: number;
    completos: number;
    incompletos: number;
  }>;
}
