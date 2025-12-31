import { type AppDispatch } from '@app/providers/store';
import { setUser } from '@entities/user';
import {
  setUsername,
  setFieldError,
  setLoading,
  setPassword,
  setSubmitError,
} from './loginSlice';
import { apiClient, API_ENDPOINTS } from '@shared/api';

interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
    name: string;
    role: 'admin' | 'operator';
    isActive: boolean;
  };
}

export const loginUser = (username: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setSubmitError(null));

  if (!username) {
    dispatch(setFieldError({ field: 'username', message: 'Es necesario rellenar los campos' }));
  }

  if (!password) {
    dispatch(setFieldError({ field: 'password', message: 'Es necesario rellenar los campos' }));
  }

  if (!username || !password) {
    return;
  }

  dispatch(setLoading(true));

  try {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, { username, password });

    dispatch(setUser(response.user));
    // Guardar tokens con rotación
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('tokenExpiresIn', String(response.expiresIn));
    dispatch(setUsername(''));
    dispatch(setPassword(''));

    // El router se encargará de la redirección automáticamente
    // cuando isAuthenticated cambie a true
  } catch (error) {
    // El apiClient ya maneja el parseo del error
    const message = error instanceof Error ? error.message : 'No fue posible iniciar sesión';
    dispatch(setSubmitError(message));
  } finally {
    dispatch(setLoading(false));
  }
};
