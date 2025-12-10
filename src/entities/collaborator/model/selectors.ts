import type { RootState } from '@app/providers/store';
import type { CollaboratorDocument, ExpedienteStatusInfo } from './types';
import { calculateExpedienteStatus, groupDocumentsByKind } from './helpers';

/**
 * Selectores para el estado de gestión de colaboradores
 */

// Estado completo
export const selectCollaboratorsState = (state: RootState) =>
  state.collaboratorsManagement;

// Lista de colaboradores
export const selectCollaborators = (state: RootState) =>
  state.collaboratorsManagement.collaborators;

// Colaborador seleccionado
export const selectSelectedCollaborator = (state: RootState) =>
  state.collaboratorsManagement.selectedCollaborator;

// Estados de carga y error
export const selectCollaboratorsLoading = (state: RootState) =>
  state.collaboratorsManagement.isLoading;

export const selectCollaboratorsError = (state: RootState) =>
  state.collaboratorsManagement.error;

// Filtros
export const selectCollaboratorsFilters = (state: RootState) =>
  state.collaboratorsManagement.filters;

// Colaborador por ID
export const selectCollaboratorById = (id: string) => (state: RootState) =>
  state.collaboratorsManagement.collaborators.find((c) => c.id === id);

// Colaboradores filtrados (filtrado en memoria, útil para búsqueda rápida)
export const selectFilteredCollaborators = (state: RootState) => {
  const { collaborators, filters } = state.collaboratorsManagement;

  return collaborators.filter((collaborator) => {
    // Filtro por búsqueda (nombre, apellidos, RPE)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        collaborator.nombre.toLowerCase().includes(searchLower) ||
        collaborator.apellidos.toLowerCase().includes(searchLower) ||
        collaborator.rpe.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Filtro por área
    if (filters.areaId && collaborator.areaId !== filters.areaId) {
      return false;
    }

    // Filtro por adscripción
    if (
      filters.adscripcionId &&
      collaborator.adscripcionId !== filters.adscripcionId
    ) {
      return false;
    }

    // Filtro por puesto
    if (filters.puestoId && collaborator.puestoId !== filters.puestoId) {
      return false;
    }

    // Filtro por tipo de contrato
    if (
      filters.tipoContrato &&
      collaborator.tipoContrato !== filters.tipoContrato
    ) {
      return false;
    }

    // Filtro por estado activo
    if (
      filters.isActive !== undefined &&
      collaborator.isActive !== filters.isActive
    ) {
      return false;
    }

    return true;
  });
};

/**
 * Selectores para el estado de gestión de documentos
 */

// Estado completo
export const selectDocumentsState = (state: RootState) =>
  state.documentsManagement;

// Lista de todos los documentos
export const selectDocuments = (state: RootState) =>
  state.documentsManagement.documents;

// Documento seleccionado
export const selectSelectedDocument = (state: RootState) =>
  state.documentsManagement.selectedDocument;

// Estados de carga y error
export const selectDocumentsLoading = (state: RootState) =>
  state.documentsManagement.isLoading;

export const selectDocumentsError = (state: RootState) =>
  state.documentsManagement.error;

// Documentos por colaborador (desde cache)
export const selectDocumentsByCollaborator = (collaboratorId: string) => (
  state: RootState
): CollaboratorDocument[] => {
  return state.documentsManagement.documentsByCollaborator[collaboratorId] || [];
};

// Documentos agrupados por tipo para un colaborador
export const selectDocumentsGroupedByKind = (collaboratorId: string) => (
  state: RootState
) => {
  const documents = selectDocumentsByCollaborator(collaboratorId)(state);
  return groupDocumentsByKind(documents);
};

// Estado del expediente para un colaborador
export const selectExpedienteStatus = (collaboratorId: string) => (
  state: RootState
): ExpedienteStatusInfo => {
  const documents = selectDocumentsByCollaborator(collaboratorId)(state);
  return calculateExpedienteStatus(documents);
};

// Verificar si un colaborador tiene un tipo específico de documento
export const selectHasDocumentKind = (
  collaboratorId: string,
  kind: string
) => (state: RootState): boolean => {
  const documents = selectDocumentsByCollaborator(collaboratorId)(state);
  return documents.some((doc) => doc.kind === kind && doc.isActive);
};

// Contar documentos por tipo para un colaborador
export const selectDocumentCountByKind = (collaboratorId: string) => (
  state: RootState
) => {
  const documents = selectDocumentsByCollaborator(collaboratorId)(state);
  const grouped = groupDocumentsByKind(documents);
  return {
    bateria: grouped.bateria?.length || 0,
    historial: grouped.historial?.length || 0,
    perfil: grouped.perfil?.length || 0,
    constancia: grouped.constancia?.length || 0,
    otro: grouped.otro?.length || 0,
    total: documents.length,
  };
};
