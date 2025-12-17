import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Minute, MinuteFilters } from './types';

/**
 * State para manejar la GESTIÓN de minutas
 */
interface MinutesManagementState {
  minutes: Minute[];
  isLoading: boolean;
  error: string | null;
  selectedMinute: Minute | null; // Minuta seleccionada para ver/editar
  filters: MinuteFilters;
}

const initialState: MinutesManagementState = {
  minutes: [],
  isLoading: false,
  error: null,
  selectedMinute: null,
  filters: {
    search: '',
  },
};

const minutesManagementSlice = createSlice({
  name: 'minutesManagement',
  initialState,
  reducers: {
    // Cargar lista completa
    setMinutes(state, action: PayloadAction<Minute[]>) {
      state.minutes = action.payload;
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
    addMinute(state, action: PayloadAction<Minute>) {
      state.minutes.push(action.payload);
    },

    updateMinute(state, action: PayloadAction<Minute>) {
      const index = state.minutes.findIndex(
        (m) => m.id === action.payload.id
      );
      if (index !== -1) {
        state.minutes[index] = action.payload;
      } else {
        // Si no existe, agregarlo (útil cuando se carga una minuta individual)
        state.minutes.push(action.payload);
      }
      // Si es la minuta seleccionada, actualizarla también
      if (state.selectedMinute?.id === action.payload.id) {
        state.selectedMinute = action.payload;
      }
    },

    removeMinute(state, action: PayloadAction<string>) {
      state.minutes = state.minutes.filter(
        (m) => m.id !== action.payload
      );
      // Si era la minuta seleccionada, limpiarla
      if (state.selectedMinute?.id === action.payload) {
        state.selectedMinute = null;
      }
    },

    // Selección de minuta
    setSelectedMinute(state, action: PayloadAction<Minute | null>) {
      state.selectedMinute = action.payload;
    },

    // Filtros
    setFilters(state, action: PayloadAction<Partial<MinuteFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    setSearchFilter(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },

    setTipoFilter(state, action: PayloadAction<string | undefined>) {
      state.filters.tipo = action.payload as any;
    },

    setFechaDesdeFilter(state, action: PayloadAction<string | undefined>) {
      state.filters.fechaDesde = action.payload;
    },

    setFechaHastaFilter(state, action: PayloadAction<string | undefined>) {
      state.filters.fechaHasta = action.payload;
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
  setMinutes,
  setLoading,
  setError,
  clearError,
  addMinute,
  updateMinute,
  removeMinute,
  setSelectedMinute,
  setFilters,
  setSearchFilter,
  setTipoFilter,
  setFechaDesdeFilter,
  setFechaHastaFilter,
  setActiveFilter,
  clearFilters,
} = minutesManagementSlice.actions;

export const minutesManagementReducer =
  minutesManagementSlice.reducer;
