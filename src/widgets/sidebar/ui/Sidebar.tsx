import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import { ROUTES } from '@shared/lib/routes';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const isAdmin = currentUser?.role === 'admin';
  const location = useLocation();

  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Menú</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
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
          <span className={styles.icon}>🤝</span>
          <span className={styles.label}>Colaboradores</span>
        </NavLink>

        <NavLink
          to={ROUTES.MINUTES}
          className={({ isActive }) => 
            `${styles.navLink} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>📝</span>
          <span className={styles.label}>Minutas</span>
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
    </>
  );
}
