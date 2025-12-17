import { useState, type FormEvent } from 'react';
import { usersApi } from '@entities/user';
import { Input, Button } from '@shared/ui';
import { useToast } from '@shared/providers';
import styles from './ChangePasswordForm.module.scss';

interface ChangePasswordFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Formulario para cambiar la contraseña del usuario
 */
export function ChangePasswordForm({
  userId,
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) {
  const { showSuccess, showError } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (!newPassword.trim()) {
      setError('La nueva contraseña es requerida');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      // Nota: En el mock API, no se valida la contraseña actual
      // En producción, esto debería validarse primero
      await usersApi.changePassword(userId, newPassword);

      // Limpiar formulario
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      showSuccess('Contraseña actualizada exitosamente');
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cambiar la contraseña';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.info}>
        <p className={styles.infoText}>
          <strong>Nota:</strong> En el sistema actual, no se valida la contraseña actual.
          En producción, esto sería requerido por seguridad.
        </p>
      </div>

      <Input
        label="Nueva Contraseña *"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={isLoading}
        required
        placeholder="Mínimo 6 caracteres"
        minLength={6}
      />

      <Input
        label="Confirmar Nueva Contraseña *"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isLoading}
        required
        placeholder="Repite la nueva contraseña"
        minLength={6}
      />

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Cambiar Contraseña
        </Button>
      </div>
    </form>
  );
}
