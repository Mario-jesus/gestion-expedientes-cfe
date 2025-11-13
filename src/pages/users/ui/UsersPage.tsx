import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@app/providers/store';
import { useUsersList, UserCard } from '@features/users/list-users';
import { CreateUserForm } from '@features/users/create-user';
import { UserDetailsModal } from '@features/users/view-user';
import { EditUserForm } from '@features/users/edit-user';
import { DeleteUserDialog } from '@features/users/delete-user';
import { setSearchTerm, setRoleFilter, clearFilters } from '@entities/user';
import type { User } from '@entities/user';
import { Modal } from '@shared/ui';
import styles from './UsersPage.module.scss';

/**
 * Página principal de gestión de usuarios
 * Solo accesible por administradores
 */
export function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, error, stats, refetch, clearError } = useUsersList();
  const { filters } = useSelector((state: RootState) => state.usersManagement);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleRoleFilter = (role: 'admin' | 'operator' | undefined) => {
    dispatch(setRoleFilter(role));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  const handleView = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    refetch();
  };

  const handleDelete = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
    refetch();
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>
            Administra los usuarios del sistema (administradores y operadores)
          </p>
        </div>

        <button
          className={styles.addButton}
          onClick={() => setIsCreateModalOpen(true)}
        >
          <span className={styles.addIcon}>➕</span>
          Agregar Usuario
        </button>
      </header>

      {/* Estadísticas */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.admins}</span>
          <span className={styles.statLabel}>Administradores</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.operators}</span>
          <span className={styles.statLabel}>Operadores</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.active}</span>
          <span className={styles.statLabel}>Activos</span>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className={styles.toolbar}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, usuario o email..."
            value={filters.searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${!filters.role ? styles.active : ''}`}
            onClick={() => handleRoleFilter(undefined)}
          >
            Todos
          </button>
          <button
            className={`${styles.filterButton} ${filters.role === 'admin' ? styles.active : ''}`}
            onClick={() => handleRoleFilter('admin')}
          >
            Administradores
          </button>
          <button
            className={`${styles.filterButton} ${filters.role === 'operator' ? styles.active : ''}`}
            onClick={() => handleRoleFilter('operator')}
          >
            Operadores
          </button>

          {(filters.searchTerm || filters.role) && (
            <button
              className={styles.clearFiltersButton}
              onClick={handleClearFilters}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className={styles.empty}>
            {filters.searchTerm || filters.role
              ? 'No se encontraron usuarios con esos criterios'
              : 'No hay usuarios registrados. Agrega el primero.'}
          </div>
        ) : (
          <div className={styles.usersList}>
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de crear usuario */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Usuario"
        size="medium"
      >
        <CreateUserForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal de ver detalles */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedUser(null);
        }}
      />

      {/* Modal de editar usuario */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          title="Editar Usuario"
          size="medium"
        >
          <EditUserForm
            user={selectedUser}
            onSuccess={handleEditSuccess}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        </Modal>
      )}

      {/* Diálogo de confirmar eliminación */}
      <DeleteUserDialog
        user={selectedUser}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
