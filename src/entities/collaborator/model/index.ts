// Types
export type {
  ContractType,
  DocumentKind,
  ExpedienteStatus,
  Collaborator,
  CreateCollaboratorDto,
  UpdateCollaboratorDto,
  CollaboratorDocument,
  CreateDocumentDto,
  UpdateDocumentDto,
  Area,
  Adscripcion,
  Puesto,
  DocumentType,
  CreateAreaDto,
  CreateAdscripcionDto,
  CreatePuestoDto,
  CreateDocumentTypeDto,
  LogEntry,
  ExpedienteStatusInfo,
  CollaboratorFilters,
  ReportSummary,
} from './types';

// Helpers
export {
  calculateExpedienteStatus,
  groupDocumentsByKind,
  getContractTypeLabel,
  getDocumentKindLabel,
} from './helpers';

// Slices
export {
  collaboratorsManagementReducer,
  setCollaborators,
  setLoading,
  setError,
  clearError,
  addCollaborator,
  updateCollaborator,
  removeCollaborator,
  setSelectedCollaborator,
  setFilters,
  setSearchFilter,
  setAreaFilter,
  setAdscripcionFilter,
  setPuestoFilter,
  setTipoContratoFilter,
  setEstadoExpedienteFilter,
  setActiveFilter,
  clearFilters,
} from './collaboratorsManagementSlice';

export {
  documentsManagementReducer,
  setDocuments,
  setCollaboratorDocuments,
  addDocument,
  updateDocument,
  removeDocument,
  setSelectedDocument,
  clearCollaboratorDocuments,
} from './documentsManagementSlice';

// Thunks
export {
  fetchCollaborators,
  fetchCollaboratorById,
  createCollaborator,
  updateCollaboratorThunk,
  deleteCollaborator,
  activateCollaborator,
  deactivateCollaborator,
} from './collaboratorsThunks';

export {
  fetchDocuments,
  fetchDocumentsByCollaborator,
  fetchDocumentById,
  createDocument,
  updateDocumentThunk,
  deleteDocument,
} from './documentsThunks';

// Selectors
export {
  selectCollaboratorsState,
  selectCollaborators,
  selectSelectedCollaborator,
  selectCollaboratorsLoading,
  selectCollaboratorsError,
  selectCollaboratorsFilters,
  selectCollaboratorById,
  selectFilteredCollaborators,
  selectDocumentsState,
  selectDocuments,
  selectSelectedDocument,
  selectDocumentsLoading,
  selectDocumentsError,
  selectDocumentsByCollaborator,
  selectDocumentsGroupedByKind,
  selectExpedienteStatus,
  selectHasDocumentKind,
  selectDocumentCountByKind,
} from './selectors';
