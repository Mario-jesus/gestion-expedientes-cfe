import { Outlet } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Sidebar } from '@widgets/sidebar';
import styles from './MainLayout.module.scss';

/**
 * Layout principal de la aplicación
 * Incluye Header, Sidebar y área de contenido
 */
export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

