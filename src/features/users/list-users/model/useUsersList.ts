import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@app/providers/store';
import { usersApi } from '@entities/user';
import {
  setUsers,
  setLoading,
  setError,
  clearError,
} from '@entities/user';

/**
 * Hook para gestionar la lista de usuarios
 * Carga usuarios del backend y proporciona funcionalidades de filtrado
 */
export const useUsersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error, filters } = useSelector(
    (state: RootState) => state.usersManagement
  );

  /**
   * Cargar usuarios desde el backend
   */
  const loadUsers = async () => {
    try {
      dispatch(clearError());
      dispatch(setLoading(true));
      const data = await usersApi.getAll();
      dispatch(setUsers(data));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
      dispatch(setError(message));
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Aplicar filtros a la lista de usuarios
   */
  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }

    // Filtrar por rol
    if (filters.role) {
      result = result.filter((user) => user.role === filters.role);
    }

    // Filtrar por estado activo
    if (filters.isActive !== undefined) {
      result = result.filter((user) => user.isActive === filters.isActive);
    }

    return result;
  }, [users, filters]);

  /**
   * Estadísticas de usuarios
   */
  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === 'admin').length,
      operators: users.filter((u) => u.role === 'operator').length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
    };
  }, [users]);

  return {
    users: filteredUsers,
    allUsers: users,
    isLoading,
    error,
    stats,
    refetch: loadUsers,
    clearError: () => dispatch(clearError()),
  };
};
