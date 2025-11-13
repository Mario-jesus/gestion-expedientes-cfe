import type { User } from '@entities/user';
import { Modal } from '@shared/ui';
import styles from './UserDetails.module.scss';

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal para mostrar los detalles completos de un usuario
 */
export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const roleLabel = user.role === 'admin' ? 'Administrador' : 'Operador';
  const statusLabel = user.isActive ? 'Activo' : 'Inactivo';

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Usuario" size="medium">
      <div className={styles.container}>
        {/* Avatar */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            <span className={styles.avatarIcon}>👤</span>
          </div>
          <div className={styles.mainInfo}>
            <h2 className={styles.userName}>{user.name}</h2>
            <p className={styles.userUsername}>@{user.username}</p>
          </div>
        </div>

        {/* Información básica */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Información Básica</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>ID</span>
              <span className={styles.infoValue}>{user.id}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Correo Electrónico</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Rol</span>
              <span className={`${styles.infoValue} ${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : styles.badgeOperator}`}>
                {roleLabel}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Estado</span>
              <span className={`${styles.infoValue} ${styles.badge} ${user.isActive ? styles.badgeActive : styles.badgeInactive}`}>
                {statusLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Información de auditoría */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Auditoría</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Fecha de Creación</span>
              <span className={styles.infoValue}>{formatDate(user.createdAt)}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Última Actualización</span>
              <span className={styles.infoValue}>{formatDate(user.updatedAt)}</span>
            </div>

            {user.createdBy && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Creado Por</span>
                <span className={styles.infoValue}>Usuario ID: {user.createdBy}</span>
              </div>
            )}
          </div>
        </div>

        {/* Botón de cerrar */}
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.closeButton}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
