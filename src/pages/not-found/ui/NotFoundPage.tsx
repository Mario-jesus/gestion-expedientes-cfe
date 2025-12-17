import { Link } from 'react-router-dom';
import { ROUTES } from '@shared/lib/routes';
import styles from './NotFoundPage.module.scss';

export function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Página no encontrada</h2>
        <p className={styles.description}>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <Link to={ROUTES.DASHBOARD} className={styles.button}>
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
