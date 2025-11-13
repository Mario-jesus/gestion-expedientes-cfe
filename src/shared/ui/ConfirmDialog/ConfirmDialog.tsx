import { Modal } from '../Modal';
import styles from './ConfirmDialog.module.scss';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

/**
 * Diálogo de confirmación reutilizable
 * Útil para acciones destructivas o importantes
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'warning',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className={styles.container}>
        <div className={`${styles.iconContainer} ${styles[variant]}`}>
          {variant === 'danger' && <span className={styles.icon}>⚠️</span>}
          {variant === 'warning' && <span className={styles.icon}>❓</span>}
          {variant === 'info' && <span className={styles.icon}>ℹ️</span>}
        </div>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`${styles.confirmButton} ${styles[variant]}`}
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
