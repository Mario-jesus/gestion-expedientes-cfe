import { type AppDispatch } from '@app/providers/store';
import { logger } from '@shared/config';
import { apiClient, API_ENDPOINTS } from '@shared/api';
import { setUser, clearUser } from './userSlice';
import type { User } from './types';

interface ValidateTokenResponse {
  user: User;
}

/**
 * Valida el token almacenado en localStorage
 * y restaura la sesión del usuario
 */
export const validateToken = () => async (dispatch: AppDispatch): Promise<boolean> => {
  const token = localStorage.getItem('token');

  // Si no hay token, no hacer nada
  if (!token) {
    logger.info('No hay token almacenado');
    return false;
  }

  try {
    logger.info('Validando token...');

    // Llamar al endpoint /auth/me que valida el token
    const response = await apiClient.get<ValidateTokenResponse>(API_ENDPOINTS.AUTH.ME);

    // Si el usuario está inactivo, limpiar sesión
    if (!response.user.isActive) {
      logger.warn('Usuario inactivo');
      localStorage.removeItem('token');
      dispatch(clearUser());
      return false;
    }

    // Token válido, restaurar usuario
    dispatch(setUser(response.user));
    logger.info('Sesión restaurada correctamente');
    return true;
  } catch (error) {
    // Token inválido o expirado
    logger.error('Error validando token:', error);
    localStorage.removeItem('token');
    dispatch(clearUser());
    return false;
  }
};
