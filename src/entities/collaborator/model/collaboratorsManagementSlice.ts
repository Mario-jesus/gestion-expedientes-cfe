import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Collaborator,
  ContractType,
  ExpedienteStatus,
  CollaboratorFilters,
} from './types';

/**
 * State para manejar la GESTIÓN de colaboradores
 * (lista completa, crear, editar, eliminar, filtros)
 */
interface CollaboratorsManagementState {
  collaborators: Collaborator[];
  isLoading: boolean;
  error: string | null;
  selectedCollaborator: Collaborator | null; // Colaborador seleccionado para ver/editar
  filters: CollaboratorFilters;
}

const initialState: CollaboratorsManagementState = {
  collaborators: [],
  isLoading: false,
  error: null,
  selectedCollaborator: null,
  filters: {
    search: '',
  },
};

const collaboratorsManagementSlice = createSlice({
  name: 'collaboratorsManagement',
  initialState,
  reducers: {
    // Cargar lista completa
    setCollaborators(state, action: PayloadAction<Collaborator[]>) {
      state.collaborators = action.payload;
      state.isLoading = false;
      state.error = null;
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
    addCollaborator(state, action: PayloadAction<Collaborator>) {
      state.collaborators.push(action.payload);
    },

    updateCollaborator(state, action: PayloadAction<Collaborator>) {
      const index = state.collaborators.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.collaborators[index] = action.payload;
      } else {
        // Si no existe, agregarlo (útil cuando se carga un colaborador individual)
        state.collaborators.push(action.payload);
      }
      // Si es el colaborador seleccionado, actualizarlo también
      if (state.selectedCollaborator?.id === action.payload.id) {
        state.selectedCollaborator = action.payload;
      }
    },

    removeCollaborator(state, action: PayloadAction<string>) {
      state.collaborators = state.collaborators.filter(
        (c) => c.id !== action.payload
      );
      // Si era el colaborador seleccionado, limpiarlo
      if (state.selectedCollaborator?.id === action.payload) {
        state.selectedCollaborator = null;
      }
    },

    // Selección de colaborador
    setSelectedCollaborator(state, action: PayloadAction<Collaborator | null>) {
      state.selectedCollaborator = action.payload;
    },

    // Filtros
    setFilters(state, action: PayloadAction<Partial<CollaboratorFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    setSearchFilter(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },

    setAreaFilter(state, action: PayloadAction<string | undefined>) {
      state.filters.areaId = action.payload;
    },

    setAdscripcionFilter(state, action: PayloadAction<string | undefined>) {
      state.filters.adscripcionId = action.payload;
    },

    setPuestoFilter(state, action: PayloadAction<string | undefined>) {
      state.filters.puestoId = action.payload;
    },

    setTipoContratoFilter(state, action: PayloadAction<ContractType | undefined>) {
      state.filters.tipoContrato = action.payload;
    },

    setEstadoExpedienteFilter(state, action: PayloadAction<ExpedienteStatus | undefined>) {
      state.filters.estadoExpediente = action.payload;
    },

    setActiveFilter(state, action: PayloadAction<boolean | undefined>) {
      state.filters.isActive = action.payload;
    },

    clearFilters(state) {
      state.filters = { search: '' };
    },
  },
});

export const {
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
} = collaboratorsManagementSlice.actions;

export const collaboratorsManagementReducer =
  collaboratorsManagementSlice.reducer;
