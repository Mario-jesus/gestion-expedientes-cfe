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
  user: {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'operator';
    isActive: boolean;
  };
  token: string;
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
    localStorage.setItem('token', response.token);
    dispatch(setUsername(''));
    dispatch(setPassword(''));

    // El router se encargará de la redirección automáticamente
    // cuando isAuthenticated cambie a true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No fue posible iniciar sesión';
    dispatch(setSubmitError(message));
  } finally {
    dispatch(setLoading(false));
  }
};
