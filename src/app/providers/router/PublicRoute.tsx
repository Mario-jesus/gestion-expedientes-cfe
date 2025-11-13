import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import { ROUTES } from '@shared/lib/routes';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente para rutas públicas (login, registro, etc.)
 * Si el usuario ya está autenticado, redirige al dashboard
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}

