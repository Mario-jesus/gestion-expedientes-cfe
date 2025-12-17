import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@app/providers/store';
import { Tabs, Modal } from '@shared/ui';
import { UpdateProfileForm } from '@features/profile/update-profile';
import { ChangePasswordForm } from '@features/profile/change-password';
import { UserActivityLog } from '@features/profile/user-activity-log';
import styles from './ProfilePage.module.scss';

/**
 * Página de perfil del usuario actual
 */
export function ProfilePage() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className={styles.page}>
        <div className={styles.loadingState}>Cargando información del usuario...</div>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    return role === 'admin' ? 'Administrador' : 'Operador';
  };

  const tabs = [
    {
      id: 'info',
      label: 'Información Personal',
      content: (
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3 className={styles.sectionTitle}>Datos del Usuario</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <label>Nombre de Usuario</label>
                <p>{currentUser.username}</p>
              </div>
              <div className={styles.infoField}>
                <label>Nombre Completo</label>
                <p>{currentUser.name}</p>
              </div>
              <div className={styles.infoField}>
                <label>Correo Electrónico</label>
                <p>{currentUser.email}</p>
              </div>
              <div className={styles.infoField}>
                <label>Rol</label>
                <p>
                  <span className={`${styles.badge} ${styles[currentUser.role]}`}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                </p>
              </div>
              <div className={styles.infoField}>
                <label>Estado</label>
                <p>
                  <span
                    className={`${styles.badge} ${
                      currentUser.isActive ? styles.active : styles.inactive
                    }`}
                  >
                    {currentUser.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
              {currentUser.createdAt && (
                <div className={styles.infoField}>
                  <label>Fecha de Registro</label>
                  <p>
                    {new Date(currentUser.createdAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
            <div className={styles.actions}>
              <button
                className={styles.editButton}
                onClick={() => setIsEditModalOpen(true)}
              >
                ✏️ Editar Información
              </button>
              <button
                className={styles.passwordButton}
                onClick={() => setIsChangePasswordModalOpen(true)}
              >
                🔒 Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'activity',
      label: 'Actividad',
      content: <UserActivityLog userId={currentUser.id} />,
    },
  ];

  const handleUpdateSuccess = () => {
    setIsEditModalOpen(false);
    // Recargar la página para actualizar los datos
    window.location.reload();
  };

  const handlePasswordChangeSuccess = () => {
    setIsChangePasswordModalOpen(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Mi Perfil</h1>
        <p className={styles.subtitle}>
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className={styles.content}>
        <Tabs tabs={tabs} defaultTabId="info" />
      </div>

      {/* Modal de edición */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Información Personal"
        size="medium"
      >
        <UpdateProfileForm
          user={currentUser}
          onSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Modal de cambio de contraseña */}
      <Modal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        title="Cambiar Contraseña"
        size="medium"
      >
        <ChangePasswordForm
          userId={currentUser.id}
          onSuccess={handlePasswordChangeSuccess}
          onCancel={() => setIsChangePasswordModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
