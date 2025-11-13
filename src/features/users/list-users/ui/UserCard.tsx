import type { User } from '@entities/user';
import styles from './UsersList.module.scss';

interface UserCardProps {
  user: User;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Tarjeta para mostrar información de un usuario
 * Incluye acciones de ver, editar y eliminar
 */
export function UserCard({ user, onView, onEdit, onDelete }: UserCardProps) {
  const roleLabel = user.role === 'admin' ? 'Administrador' : 'Operador';
  const statusLabel = user.isActive ? 'Activo' : 'Inactivo';

  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>
        <div className={styles.userIconCircle}>
          <span className={styles.userIcon}>👤</span>
        </div>
      </div>

      <div className={styles.cardContent}>
        <p className={styles.field}>
          <strong>Nombre:</strong> {user.name}
        </p>
        <p className={styles.field}>
          <strong>Usuario:</strong> {user.username}
        </p>
        <p className={styles.field}>
          <strong>Email:</strong> {user.email}
        </p>
        <p className={styles.field}>
          <strong>Rol:</strong>{' '}
          <span className={user.role === 'admin' ? styles.roleAdmin : styles.roleOperator}>
            {roleLabel}
          </span>
        </p>
        <p className={styles.field}>
          <strong>Estado:</strong>{' '}
          <span className={user.isActive ? styles.statusActive : styles.statusInactive}>
            {statusLabel}
          </span>
        </p>
      </div>

      <div className={styles.cardActions}>
        <button
          className={`${styles.actionButton} ${styles.viewButton}`}
          onClick={() => onView(user.id)}
          title="Ver detalles"
        >
          <span className={styles.actionIcon}>👁️</span>
          <span className={styles.actionLabel}>Ver</span>
        </button>
        <button
          className={`${styles.actionButton} ${styles.editButton}`}
          onClick={() => onEdit(user.id)}
          title="Editar"
        >
          <span className={styles.actionIcon}>✏️</span>
          <span className={styles.actionLabel}>Editar</span>
        </button>
        <button
          className={`${styles.actionButton} ${styles.deleteButton}`}
          onClick={() => onDelete(user.id)}
          title="Eliminar"
        >
          <span className={styles.actionIcon}>❌</span>
          <span className={styles.actionLabel}>Eliminar</span>
        </button>
      </div>
    </div>
  );
}
