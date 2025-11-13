// Types
export type { User, UserRole, CreateUserDto, UpdateUserDto, ChangePasswordDto } from './types';

// User Slice (sesión actual)
export { userReducer, setUser, clearUser } from './userSlice';

// Users Management Slice (CRUD de usuarios)
export {
  usersManagementReducer,
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
} from './usersManagementSlice';

// Thunks
export { validateToken } from './userThunks';
