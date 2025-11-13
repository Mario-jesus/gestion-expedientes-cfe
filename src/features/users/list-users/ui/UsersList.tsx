import { UserCard } from './UserCard';
import { useUsersList } from '../model/useUsersList';
import styles from './UsersList.module.scss';

interface UsersListProps {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Componente que muestra la lista de usuarios
 * Maneja estados de carga, error y lista vacía
 */
export function UsersList({ onView, onEdit, onDelete }: UsersListProps) {
  const { users, isLoading, error, clearError } = useUsersList();

  if (isLoading) {
    return <div className={styles.loadingState}>Cargando usuarios</div>;
  }

  if (error) {
    return (
      <div className={styles.errorState}>
        <p>{error}</p>
        <button onClick={clearError}>Cerrar</button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        No se encontraron usuarios. Agrega el primero.
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
