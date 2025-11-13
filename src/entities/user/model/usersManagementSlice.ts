import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserRole } from './types';

/**
 * State para manejar la GESTIÓN de usuarios del sistema
 * (lista completa, crear, editar, eliminar)
 * Solo accesible por administradores
 */
interface UsersManagementState {
  users: User[]; // Lista completa de usuarios
  isLoading: boolean;
  error: string | null;
  selectedUser: User | null; // Usuario seleccionado para ver/editar
  filters: {
    role?: UserRole; // Filtrar por rol
    isActive?: boolean; // Filtrar por estado
    searchTerm: string; // Búsqueda por nombre/username
  };
}

const initialState: UsersManagementState = {
  users: [],
  isLoading: false,
  error: null,
  selectedUser: null,
  filters: {
    searchTerm: '',
  },
};

const usersManagementSlice = createSlice({
  name: 'usersManagement',
  initialState,
  reducers: {
    // Cargar lista completa
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
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
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload);
    },

    updateUser(state, action: PayloadAction<User>) {
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      // Si es el usuario seleccionado, actualizarlo también
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    },

    removeUser(state, action: PayloadAction<string>) {
      state.users = state.users.filter((u) => u.id !== action.payload);
      // Si era el usuario seleccionado, limpiarlo
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },

    // Selección de usuario
    setSelectedUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload;
    },

    // Filtros
    setSearchTerm(state, action: PayloadAction<string>) {
      state.filters.searchTerm = action.payload;
    },

    setRoleFilter(state, action: PayloadAction<UserRole | undefined>) {
      state.filters.role = action.payload;
    },

    setActiveFilter(state, action: PayloadAction<boolean | undefined>) {
      state.filters.isActive = action.payload;
    },

    clearFilters(state) {
      state.filters = { searchTerm: '' };
    },
  },
});

export const {
  setUsers,
  setLoading,
  setError,
  clearError,
  addUser,
  updateUser,
  removeUser,
  setSelectedUser,
  setSearchTerm,
  setRoleFilter,
  setActiveFilter,
  clearFilters,
} = usersManagementSlice.actions;

export const usersManagementReducer = usersManagementSlice.reducer;
