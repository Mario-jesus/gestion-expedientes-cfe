import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CollaboratorDocument } from './types';

/**
 * State para manejar la GESTIÓN de documentos de colaboradores
 */
interface DocumentsManagementState {
  documents: CollaboratorDocument[];
  isLoading: boolean;
  error: string | null;
  selectedDocument: CollaboratorDocument | null;
  // Documentos agrupados por colaborador (cache)
  documentsByCollaborator: Record<string, CollaboratorDocument[]>;
}

const initialState: DocumentsManagementState = {
  documents: [],
  isLoading: false,
  error: null,
  selectedDocument: null,
  documentsByCollaborator: {},
};

const documentsManagementSlice = createSlice({
  name: 'documentsManagement',
  initialState,
  reducers: {
    // Cargar lista completa
    setDocuments(state, action: PayloadAction<CollaboratorDocument[]>) {
      state.documents = action.payload;
      state.isLoading = false;
      state.error = null;

      // Actualizar cache por colaborador
      state.documentsByCollaborator = action.payload.reduce(
        (acc, doc) => {
          if (!acc[doc.collaboratorId]) {
            acc[doc.collaboratorId] = [];
          }
          acc[doc.collaboratorId].push(doc);
          return acc;
        },
        {} as Record<string, CollaboratorDocument[]>
      );
    },

    // Cargar documentos de un colaborador específico
    setCollaboratorDocuments(
      state,
      action: PayloadAction<{ collaboratorId: string; documents: CollaboratorDocument[] }>
    ) {
      const { collaboratorId, documents } = action.payload;
      state.documentsByCollaborator[collaboratorId] = documents;

      // Actualizar lista general (merge, sin duplicados)
      const existingIds = new Set(state.documents.map((d) => d.id));
      const newDocuments = documents.filter((d) => !existingIds.has(d.id));
      state.documents.push(...newDocuments);
    },

    // Estados de carga
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    // Manejo de errores
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },

    // CRUD operations
    addDocument(state, action: PayloadAction<CollaboratorDocument>) {
      state.documents.push(action.payload);

      // Actualizar cache
      const doc = action.payload;
      if (!state.documentsByCollaborator[doc.collaboratorId]) {
        state.documentsByCollaborator[doc.collaboratorId] = [];
      }
      state.documentsByCollaborator[doc.collaboratorId].push(doc);
    },

    updateDocument(state, action: PayloadAction<CollaboratorDocument>) {
      const index = state.documents.findIndex(
        (d) => d.id === action.payload.id
      );
      if (index !== -1) {
        state.documents[index] = action.payload;
      }

      // Actualizar cache
      const doc = action.payload;
      const collaboratorDocs = state.documentsByCollaborator[doc.collaboratorId] || [];
      const docIndex = collaboratorDocs.findIndex((d) => d.id === doc.id);
      if (docIndex !== -1) {
        collaboratorDocs[docIndex] = doc;
        state.documentsByCollaborator[doc.collaboratorId] = collaboratorDocs;
      }

      // Si es el documento seleccionado, actualizarlo también
      if (state.selectedDocument?.id === action.payload.id) {
        state.selectedDocument = action.payload;
      }
    },

    removeDocument(state, action: PayloadAction<string>) {
      const doc = state.documents.find((d) => d.id === action.payload);
      state.documents = state.documents.filter((d) => d.id !== action.payload);

      // Actualizar cache
      if (doc) {
        const collaboratorDocs = state.documentsByCollaborator[doc.collaboratorId] || [];
        state.documentsByCollaborator[doc.collaboratorId] = collaboratorDocs.filter(
          (d) => d.id !== action.payload
        );
      }

      // Si era el documento seleccionado, limpiarlo
      if (state.selectedDocument?.id === action.payload) {
        state.selectedDocument = null;
      }
    },

    // Selección de documento
    setSelectedDocument(
      state,
      action: PayloadAction<CollaboratorDocument | null>
    ) {
      state.selectedDocument = action.payload;
    },

    // Limpiar documentos de un colaborador (útil al eliminar colaborador)
    clearCollaboratorDocuments(state, action: PayloadAction<string>) {
      const collaboratorId = action.payload;
      state.documents = state.documents.filter(
        (d) => d.collaboratorId !== collaboratorId
      );
      delete state.documentsByCollaborator[collaboratorId];
    },
  },
});

export const {
  setDocuments,
  setCollaboratorDocuments,
  setLoading,
  setError,
  clearError,
  addDocument,
  updateDocument,
  removeDocument,
  setSelectedDocument,
  clearCollaboratorDocuments,
} = documentsManagementSlice.actions;

export const documentsManagementReducer = documentsManagementSlice.reducer;
