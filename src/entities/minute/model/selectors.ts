import type { RootState } from '@app/providers/store';

/**
 * Selectores para el estado de gestión de minutas
 */

// Estado completo
export const selectMinutesState = (state: RootState) =>
  state.minutesManagement;

// Lista de minutas
export const selectMinutes = (state: RootState) =>
  state.minutesManagement.minutes;

// Minuta seleccionada
export const selectSelectedMinute = (state: RootState) =>
  state.minutesManagement.selectedMinute;

// Estados de carga y error
export const selectMinutesLoading = (state: RootState) =>
  state.minutesManagement.isLoading;

export const selectMinutesError = (state: RootState) =>
  state.minutesManagement.error;

// Filtros
export const selectMinutesFilters = (state: RootState) =>
  state.minutesManagement.filters;

// Minuta por ID
export const selectMinuteById = (id: string) => (state: RootState) =>
  state.minutesManagement.minutes.find((m) => m.id === id);

// Minutas filtradas
export const selectFilteredMinutes = (state: RootState) => {
  const { minutes, filters } = state.minutesManagement;

  return minutes.filter((minute) => {
    // Filtro por búsqueda (título o descripción)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        minute.titulo.toLowerCase().includes(searchLower) ||
        (minute.descripcion &&
          minute.descripcion.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Filtro por tipo
    if (filters.tipo && minute.tipo !== filters.tipo) {
      return false;
    }

    // Filtro por fecha desde
    if (filters.fechaDesde && minute.fecha < filters.fechaDesde) {
      return false;
    }

    // Filtro por fecha hasta
    if (filters.fechaHasta && minute.fecha > filters.fechaHasta) {
      return false;
    }

    // Filtro por estado activo
    if (
      filters.isActive !== undefined &&
      minute.isActive !== filters.isActive
    ) {
      return false;
    }

    return true;
  });
};
