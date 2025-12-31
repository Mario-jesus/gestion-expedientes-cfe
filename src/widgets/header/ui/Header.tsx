import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '@app/providers/store';
import { clearUser } from '@entities/user';
import { usersApi } from '@entities/user';
import { logger } from '@shared/config';
import { ROUTES } from '@shared/lib/routes';
import styles from './Header.module.scss';

interface HeaderProps {
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

export function Header({ onMenuClick, isMenuOpen = false }: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout para invalidar el token en el servidor
      await usersApi.logout();
      logger.info('Logout exitoso');
    } catch (error) {
      // Si falla el logout, continuar con la limpieza local de todas formas
      logger.error('Error al hacer logout en el servidor:', error);
    } finally {
      // Limpiar todos los tokens del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresIn');

      // Limpiar estado de usuario
      dispatch(clearUser());

      // Redirigir al login
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <button
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
          >
            <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div className={styles.logo}>
            <span className={styles.logoText}>CFE</span>
            <span className={styles.logoSubtext}>Sistema de Expedientes</span>
          </div>
        </div>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{currentUser?.name}</span>
            <span className={styles.userRole}>
              {currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}
            </span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
            🚪 Salir
          </button>
        </div>
      </div>
    </header>
  );
}
