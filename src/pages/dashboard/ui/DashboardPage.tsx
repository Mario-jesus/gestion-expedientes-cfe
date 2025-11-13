import { useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import styles from './DashboardPage.module.scss';

export function DashboardPage() {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Panel de Control</h1>
        <p className={styles.subtitle}>
          Bienvenido, <strong>{currentUser?.name}</strong>
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>📁</div>
          <h3 className={styles.cardTitle}>Expedientes</h3>
          <p className={styles.cardValue}>0</p>
          <p className={styles.cardLabel}>Total de expedientes</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>👥</div>
          <h3 className={styles.cardTitle}>Colaboradores</h3>
          <p className={styles.cardValue}>0</p>
          <p className={styles.cardLabel}>Registrados en el sistema</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>📄</div>
          <h3 className={styles.cardTitle}>Documentos</h3>
          <p className={styles.cardValue}>0</p>
          <p className={styles.cardLabel}>Archivos almacenados</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>⚡</div>
          <h3 className={styles.cardTitle}>Accesos Rápidos</h3>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>Nuevo Expediente</button>
            <button className={styles.actionBtn}>Ver Listado</button>
          </div>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h3>🎯 Información del Usuario</h3>
        <div className={styles.infoGrid}>
          <div>
            <strong>Usuario:</strong> {currentUser?.username}
          </div>
          <div>
            <strong>Rol:</strong> {currentUser?.role === 'admin' ? 'Administrador' : 'Operador'}
          </div>
          <div>
            <strong>Estado:</strong> {currentUser?.isActive ? '✅ Activo' : '❌ Inactivo'}
          </div>
        </div>
      </div>
    </div>
  );
}
