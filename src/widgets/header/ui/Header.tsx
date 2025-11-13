import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '@app/providers/store';
import { clearUser } from '@entities/user';
import { ROUTES } from '@shared/lib/routes';
import styles from './Header.module.scss';

export function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    // Limpiar token
    localStorage.removeItem('token');

    // Limpiar estado de usuario
    dispatch(clearUser());

    // Redirigir al login
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>CFE</span>
          <span className={styles.logoSubtext}>Sistema de Expedientes</span>
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
