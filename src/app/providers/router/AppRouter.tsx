import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, DashboardPage, NotFoundPage, UsersPage } from '@pages/index';
import { ROUTES } from '@shared/lib/routes';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { MainLayout } from './MainLayout';

/**
 * Página temporal para rutas no implementadas
 */
function ComingSoonPage({ title }: { title: string }) {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🚧 {title}</h1>
      <p>Esta página está en construcción</p>
    </div>
  );
}

/**
 * Configuración principal de rutas de la aplicación
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz redirige al dashboard */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Rutas públicas */}
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas con layout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

          {/* Expedientes */}
          <Route
            path={ROUTES.EMPLOYEES}
            element={<ComingSoonPage title="Expedientes" />}
          />
          <Route
            path={ROUTES.EMPLOYEE_NEW}
            element={<ComingSoonPage title="Nuevo Expediente" />}
          />
          <Route
            path={ROUTES.EMPLOYEE_DETAIL}
            element={<ComingSoonPage title="Detalle de Expediente" />}
          />

          {/* Archivos */}
          <Route
            path={ROUTES.FILES}
            element={<ComingSoonPage title="Archivos" />}
          />

          {/* Perfil */}
          <Route
            path={ROUTES.PROFILE}
            element={<ComingSoonPage title="Mi Perfil" />}
          />

          {/* Rutas solo para administradores */}
          <Route
            path={ROUTES.USERS}
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <ComingSoonPage title="Configuración" />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
