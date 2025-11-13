import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import type { UserRole } from '@entities/user';
import { ROUTES } from '@shared/lib/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
}

/**
 * Componente para proteger rutas que requieren autenticación
 * Opcionalmente verifica roles específicos
 */
export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user);

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Si el usuario está inactivo, redirigir al login
  if (!currentUser.isActive) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Verificar roles si se especificaron
  if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
    // Usuario autenticado pero sin permisos suficientes
    // Redirigir al dashboard con mensaje (implementar notificaciones después)
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
}

