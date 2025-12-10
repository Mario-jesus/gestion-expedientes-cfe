import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import { ROUTES } from '@shared/lib/routes';
import styles from './Sidebar.module.scss';

export function Sidebar() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isAdmin = currentUser?.role === 'admin';
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>📊</span>
          <span className={styles.label}>Dashboard</span>
        </NavLink>

        <NavLink
          to={ROUTES.COLLABORATORS}
          className={({ isActive }) => {
            // Verificar si la ruta actual comienza con /colaboradores
            const isCollaboratorRoute = location.pathname.startsWith('/colaboradores');
            const shouldBeActive = isActive || isCollaboratorRoute;
            return `${styles.navLink} ${shouldBeActive ? styles.active : ''}`;
          }}
        >
          <span className={styles.icon}>📁</span>
          <span className={styles.label}>Expedientes</span>
        </NavLink>

        <NavLink
          to={ROUTES.FILES}
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>📄</span>
          <span className={styles.label}>Archivos</span>
        </NavLink>

        {isAdmin && (
          <>
            <div className={styles.divider} />
            
            <NavLink
              to={ROUTES.USERS}
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>👥</span>
              <span className={styles.label}>Usuarios</span>
            </NavLink>

            <NavLink
              to={ROUTES.SETTINGS}
              className={({ isActive }) => 
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>⚙️</span>
              <span className={styles.label}>Configuración</span>
            </NavLink>
          </>
        )}

        <div className={styles.divider} />

        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>👤</span>
          <span className={styles.label}>Mi Perfil</span>
        </NavLink>
      </nav>
    </aside>
  );
}
