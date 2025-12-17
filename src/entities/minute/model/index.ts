// Types
export type {
  MinuteType,
  Minute,
  CreateMinuteDto,
  UpdateMinuteDto,
  MinuteFilters,
} from './types';

// Helpers
export { getMinuteTypeLabel } from './helpers';

// Slices
export {
  minutesManagementReducer,
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
} from './minutesManagementSlice';

// Thunks
export {
  fetchMinutes,
  fetchMinuteById,
  createMinute,
  updateMinuteThunk,
  deleteMinute,
} from './minutesThunks';

// Selectors
export {
  selectMinutesState,
  selectMinutes,
  selectSelectedMinute,
  selectMinutesLoading,
  selectMinutesError,
  selectMinutesFilters,
  selectMinuteById,
  selectFilteredMinutes,
} from './selectors';
