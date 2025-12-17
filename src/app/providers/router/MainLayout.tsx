import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Sidebar } from '@widgets/sidebar';
import styles from './MainLayout.module.scss';

/**
 * Layout principal de la aplicación
 * Incluye Header, Sidebar y área de contenido
 */
export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Cerrar sidebar al navegar en móviles
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Prevenir scroll del body cuando el sidebar está abierto en móviles
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className={styles.layout}>
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isMenuOpen={isSidebarOpen}
      />
      <div className={styles.content}>
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        {isSidebarOpen && (
          <div 
            className={styles.overlay}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Cerrar menú"
          />
        )}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
